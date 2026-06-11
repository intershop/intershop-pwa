import * as fs from 'fs';
import { basename, join, normalize } from 'path';

export const THEME_PLACEHOLDER = 'theme_placeholder';
export const ANGULAR_CACHE_DIR = join('.angular', 'cache');

export interface ThemeBuildContext {
  availableThemes: string[];
  configuration: string;
  production: boolean;
  theme: string;
}

interface ThemeAngularJsonConfig {
  buildOptimizer?: boolean;
}

interface ThemeTargetOptions {
  configuration?: string;
  project: string;
  target: string;
}

interface AngularWorkspaceTarget {
  configurations?: Record<string, unknown>;
  defaultConfiguration?: string;
}

interface AngularWorkspaceProject {
  architect?: Record<string, AngularWorkspaceTarget>;
  root?: string;
}

interface AngularWorkspace {
  projects: Record<string, AngularWorkspaceProject>;
}

function readAngularWorkspace(angularJsonPath = 'angular.json'): AngularWorkspace {
  return JSON.parse(fs.readFileSync(angularJsonPath, { encoding: 'utf-8' })) as AngularWorkspace;
}

function isThemeConfiguration(configuration: string): boolean {
  return configuration !== 'development' && configuration !== 'production';
}

function getDefaultProjectName(angularJson: AngularWorkspace): string {
  const projectName = Object.keys(angularJson.projects).find(project => angularJson.projects[project].root === '');
  if (!projectName) {
    throw new Error('Could not determine default Angular project with root "".');
  }
  return projectName;
}

function crawlFiles(folder: string, callback: (files: string[]) => void) {
  if (fs.statSync(folder).isDirectory() && !['node_modules', '.git'].some(baseName => folder.endsWith(baseName))) {
    const content = fs.readdirSync(folder).map(file => join(folder, file));

    const files = content.filter(file => fs.statSync(file).isFile());
    if (files.length) {
      callback(files);
    }

    content.filter(file => fs.statSync(file).isDirectory()).forEach(directory => crawlFiles(directory, callback));
  }
}

function replaceStringValues(root: unknown, searchValue: string, replacementValue: string) {
  if (!root || typeof root !== 'object') {
    return;
  }

  const record = root as Record<string, unknown>;
  Object.keys(record).forEach(key => {
    const value = record[key];
    if (typeof value === 'string' && value.includes(searchValue)) {
      record[key] = value.replace(searchValue, replacementValue);
    }
  });

  Object.values(record).forEach(value => replaceStringValues(value, searchValue, replacementValue));
}

export function resolveThemeBuildContext(
  angularJsonConfig: ThemeAngularJsonConfig,
  targetOptions: ThemeTargetOptions
): ThemeBuildContext {
  const angularJson = readAngularWorkspace();

  const target = angularJson.projects[targetOptions.project]?.architect?.[targetOptions.target];
  const configuration = targetOptions.configuration || target?.defaultConfiguration || 'b2b,production';

  if (configuration === 'development' || configuration === 'production') {
    throw new Error(
      `configuration cannot just be ${configuration}, it has to be used with a theme (--configuration=<theme>,${configuration})`
    );
  }

  const defaultProjectName = getDefaultProjectName(angularJson);
  const availableThemes = Object.keys(angularJson.projects[defaultProjectName].architect?.build.configurations || {});
  const configRegex = `^(${availableThemes.filter(isThemeConfiguration).join('|')}),(development|production)$`;
  if (!new RegExp(configRegex).test(configuration)) {
    throw new Error(`requested configuration does not match pattern '${configRegex}'`);
  }

  const configurations = configuration.split(',');
  const theme = configurations.filter(isThemeConfiguration)[0];
  const production = !!(configurations.includes('production') || angularJsonConfig.buildOptimizer);

  return {
    availableThemes,
    configuration,
    production,
    theme,
  };
}

export function resolveThemeFileReplacements(
  theme: string,
  availableThemes: string[],
  workspaceRoot = process.cwd()
): Record<string, string> {
  const files: string[] = [];
  crawlFiles(workspaceRoot, foundFiles => files.push(...foundFiles));

  const themes = [...availableThemes, 'all'];

  files.forEach(file => {
    const usedThemes = themes.filter(themeName => basename(file).includes(`.${themeName}.`));
    if (usedThemes.length > 1 && usedThemes.includes('all')) {
      throw new Error(`override for 'all' cannot be used next to other themes:\n  ${file}`);
    }
  });

  const replacers = files
    .filter(file => ['html', 'scss', 'ts'].some(extension => file.endsWith(extension)) && !file.endsWith('.spec.ts'))
    .reduce<Record<string, string[]>>((accumulator, file) => {
      const original = themes.reduce((name, themeName) => name.replace(`.${themeName}.`, '.'), file);

      if (original !== file && [`.${theme}`, '.all.'].some(themeMarker => file.includes(themeMarker))) {
        accumulator[original] = [...(accumulator[original] || []), file].sort((left, right) => {
          if (left.includes(`.'${theme}.`) || right.includes('.all.')) {
            return -1;
          } else if (right.includes(`.'${theme}.`) || left.includes('.all.')) {
            return 1;
          }
          return 0;
        });
      }
      return accumulator;
    }, {});

  const fileReplacements: Record<string, string> = {};
  Object.entries(replacers)
    .map(([original, overrides]) => ({
      replacement: overrides[0],
      original,
    }))
    .filter(replacement => files.includes(replacement.original))
    .forEach(replacement => {
      fileReplacements[replacement.original] = replacement.replacement;
    });

  return fileReplacements;
}

export function buildResourceReplacements(fileReplacements: Record<string, string>): Record<string, string> {
  return Object.entries(fileReplacements).reduce<Record<string, string>>((accumulator, [key, value]) => {
    if (!key.endsWith('.ts')) {
      accumulator[normalize(key)] = value;
      accumulator[key.replace(/\\/g, '/')] = value;
    }
    return accumulator;
  }, {});
}

export function applyThemePlaceholder(root: unknown, theme: string) {
  replaceStringValues(root, THEME_PLACEHOLDER, theme);
}

export function applyThemeCacheDirectory(root: unknown, theme: string) {
  replaceStringValues(root, ANGULAR_CACHE_DIR, join(ANGULAR_CACHE_DIR, theme));
}

export function toRelativeReplacements(
  fileReplacements: Record<string, string>,
  workspaceRoot = process.cwd()
): Record<string, string> {
  const rootLength = workspaceRoot.length + 1;
  const toRelativePath = (file: string) => file.substring(rootLength).replace(/\\/g, '/');
  const relativeReplacements: Record<string, string> = {};

  Object.entries(fileReplacements).forEach(([original, replacement]) => {
    relativeReplacements[toRelativePath(original)] = toRelativePath(replacement);
  });

  return relativeReplacements;
}

export function writeReplacementsJson(
  outputPath: string,
  fileReplacements: Record<string, string>,
  workspaceRoot = process.cwd()
): string {
  const replacementsPath = join(outputPath, 'replacements.json');
  fs.writeFileSync(
    replacementsPath,
    JSON.stringify(toRelativeReplacements(fileReplacements, workspaceRoot), undefined, 2)
  );
  return replacementsPath;
}
