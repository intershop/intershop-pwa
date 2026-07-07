import { Architect, type BuilderRun } from '@angular-devkit/architect';
import { WorkspaceNodeModulesArchitectHost } from '@angular-devkit/architect/node';
import { json, workspaces } from '@angular-devkit/core';
import { NodeJsSyncHost, createConsoleLogger } from '@angular-devkit/core/node';
import { createHash } from 'crypto';
import * as fs from 'fs';
import { join } from 'path';

import {
  ANGULAR_CACHE_DIR,
  applyThemePlaceholder,
  buildResourceReplacements,
  resolveThemeBuildContext,
  resolveThemeFileReplacements,
  toRelativeReplacements,
} from './theme-resolver';

/* eslint-disable max-lines, no-console */

interface AngularFileReplacement {
  replace: string;
  with: string;
}

interface FileOverlay {
  content: Buffer | string;
  original: string;
  replacement?: string;
}

interface AngularWorkspaceTarget {
  builder?: string;
  configurations?: Record<string, Record<string, unknown>>;
  defaultConfiguration?: string;
  options?: Record<string, unknown>;
}

interface AngularWorkspaceProject {
  architect?: Record<string, AngularWorkspaceTarget>;
  root?: string;
}

interface AngularWorkspace {
  cli?: Record<string, unknown>;
  projects: Record<string, AngularWorkspaceProject>;
}

interface ParsedArgs {
  configuration?: string;
  dryRun: boolean;
  overrides: Record<string, json.JsonValue>;
}

interface TargetSpecifier {
  project: string;
  target: string;
  configuration?: string;
}

interface BuildContext {
  buildConfiguration: string;
  buildConfigurationOptions: Record<string, unknown>;
  buildTarget: TargetSpecifier;
}

interface ThemeReplacementContext {
  angularFileReplacements: AngularFileReplacement[];
  cachePath?: string;
  resourceReplacements: Record<string, string>;
  theme: string;
}

const WORKSPACE_PATH = 'angular.json';

const SUPPORTED_REPLACEMENT_EXTENSION = /\.(c?js|m?js|tsx?|json)$/;

function dasherizeToCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function parseValue(value: string): json.JsonValue {
  if (/^(true|false)$/i.test(value)) {
    return /^true$/i.test(value);
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}

function getNpmConfigOption(name: string): string | undefined {
  return process.env[`npm_config_${name.replace(/-/g, '_')}`];
}

function isTruthy(value: string | undefined): boolean {
  return /^(1|true|yes)$/i.test(value || '');
}

function parseArgs(args: string[]): ParsedArgs {
  const overrides: Record<string, json.JsonValue> = {};
  let configuration = getNpmConfigOption('configuration');
  let dryRun = isTruthy(getNpmConfigOption('dry-run'));

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '-c' || arg === '--configuration') {
      configuration = args[++index];
      continue;
    }
    if (arg.startsWith('--configuration=') || arg.startsWith('-c=')) {
      configuration = arg.split('=')[1];
      continue;
    }
    if (arg.startsWith('--no-')) {
      overrides[dasherizeToCamelCase(arg.slice(5))] = false;
      continue;
    }
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=', 2);
      overrides[dasherizeToCamelCase(key)] = value === undefined ? true : parseValue(value);
    }
  }

  return { configuration, dryRun, overrides };
}

function withDevServerDefaults(overrides: Record<string, json.JsonValue>): Record<string, json.JsonValue> {
  return {
    watch: true,
    liveReload: true,
    ...overrides,
  };
}

function readWorkspace(): AngularWorkspace {
  return JSON.parse(fs.readFileSync(WORKSPACE_PATH, 'utf-8')) as AngularWorkspace;
}

function getDefaultProjectName(workspace: AngularWorkspace): string {
  const projectName = Object.keys(workspace.projects).find(project => workspace.projects[project].root === '');
  if (!projectName) {
    throw new Error('Could not determine default project in Angular workspace.');
  }
  return projectName;
}

function parseTargetSpecifier(value: string, fallbackProject: string): TargetSpecifier {
  const [projectOrTarget, targetOrConfiguration, ...configurationParts] = value.split(':');

  if (!targetOrConfiguration) {
    return { project: fallbackProject, target: projectOrTarget };
  }

  return {
    project: projectOrTarget,
    target: targetOrConfiguration,
    configuration: configurationParts.join(':') || undefined,
  };
}

function toThemeContextConfiguration(configuration: string): string {
  const serveConfiguration = /^(.+)-serve-(development|production)$/.exec(configuration);
  return serveConfiguration ? `${serveConfiguration[1]},${serveConfiguration[2]}` : configuration;
}

function getBuildMode(configuration: string): string {
  return configuration.includes('production') ? 'production' : 'development';
}

function getDevServerCachePath(
  buildTargetName: string,
  theme: string,
  buildMode: string,
  fileOverlayCacheKey: string
): string {
  return join(ANGULAR_CACHE_DIR, buildTargetName, theme, buildMode, fileOverlayCacheKey);
}

function getServeBuildTarget(
  workspace: AngularWorkspace,
  projectName: string,
  serveConfiguration: string
): TargetSpecifier {
  const serveTarget = workspace.projects[projectName].architect?.serve;
  const serveOptions = serveTarget?.options || {};
  const serveConfigurationOptions = serveTarget?.configurations?.[serveConfiguration] || {};
  const buildTarget = serveConfigurationOptions.buildTarget || serveOptions.buildTarget;

  if (typeof buildTarget !== 'string') {
    throw new Error(`Could not find buildTarget for serve configuration '${serveConfiguration}'.`);
  }

  return parseTargetSpecifier(buildTarget, projectName);
}

function getServeConfiguration(workspace: AngularWorkspace, projectName: string, configuration?: string): string {
  return configuration || workspace.projects[projectName].architect?.serve?.defaultConfiguration || 'b2b';
}

function getBuildContext(workspace: AngularWorkspace, projectName: string, serveConfiguration: string): BuildContext {
  const buildTarget = getServeBuildTarget(workspace, projectName, serveConfiguration);
  const project = workspace.projects[buildTarget.project];
  const target = project?.architect?.[buildTarget.target];
  const buildConfiguration = buildTarget.configuration || target?.defaultConfiguration;
  const buildConfigurationOptions = buildConfiguration ? target?.configurations?.[buildConfiguration] : undefined;

  if (!target?.builder || !target.options || !buildConfiguration || !buildConfigurationOptions) {
    throw new Error(
      `Could not resolve build target '${buildTarget.project}:${buildTarget.target}:${buildConfiguration}'.`
    );
  }

  return { buildConfiguration, buildConfigurationOptions, buildTarget };
}

function toAngularFileReplacements(fileReplacements: Record<string, string>) {
  return Object.entries(toRelativeReplacements(fileReplacements))
    .filter(
      ([original, replacement]) =>
        SUPPORTED_REPLACEMENT_EXTENSION.test(original) && SUPPORTED_REPLACEMENT_EXTENSION.test(replacement)
    )
    .map(([replace, withPath]) => ({ replace, with: withPath }));
}

function isAngularFileReplacement(value: unknown): value is AngularFileReplacement {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const fileReplacement = value as Partial<AngularFileReplacement>;
  return typeof fileReplacement.replace === 'string' && typeof fileReplacement.with === 'string';
}

function mergeFileReplacements(
  existingReplacements: unknown,
  generatedReplacements: AngularFileReplacement[]
): AngularFileReplacement[] {
  const replacements = new Map<string, AngularFileReplacement>();

  if (Array.isArray(existingReplacements)) {
    existingReplacements.filter(isAngularFileReplacement).forEach(replacement => {
      replacements.set(replacement.replace, replacement);
    });
  }

  generatedReplacements.forEach(replacement => {
    replacements.set(replacement.replace, replacement);
  });

  return [...replacements.values()];
}

function createResourceFileOverlays(resourceReplacements: Record<string, string>): FileOverlay[] {
  const seenOriginals = new Set<string>();

  return Object.entries(resourceReplacements)
    .filter(([original]) => {
      const normalizedOriginal = fs.realpathSync.native(original);
      if (seenOriginals.has(normalizedOriginal)) {
        return false;
      }
      seenOriginals.add(normalizedOriginal);
      return true;
    })
    .map(([original, replacement]) => ({
      content: fs.readFileSync(replacement),
      original,
      replacement,
    }));
}

function applyFileOverlays(fileOverlays: FileOverlay[]): () => void {
  const backups = fileOverlays.map(({ content: replacementContent, original }) => ({
    content: fs.readFileSync(original),
    original,
    replacementContent,
  }));

  backups.forEach(({ original, replacementContent }) => {
    fs.writeFileSync(original, replacementContent);
  });

  return () => {
    backups.forEach(({ content, original }) => {
      fs.writeFileSync(original, content);
    });
  };
}

function getThemeColor(theme: string): string {
  const manifestPath = join('src', 'assets', 'themes', theme, 'manifest.webmanifest');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as { theme_color?: string };
  return manifest.theme_color || '#006b99';
}

function createThemedIndexOverlay(theme: string): FileOverlay {
  const indexPath = join('src', 'index.html');
  const themeColor = getThemeColor(theme);
  const content = fs
    .readFileSync(indexPath, 'utf-8')
    .replace(/assets\/themes\/[^/]+/g, `assets/themes/${theme}`)
    .replace(/theme_placeholder/g, theme)
    .replace(/<meta content="[^"]+" name="theme-color" \/>/, `<meta content="${themeColor}" name="theme-color" />`)
    .replace(/<meta content="[^"]+" name="theme-color">/, `<meta content="${themeColor}" name="theme-color">`);

  return {
    content,
    original: indexPath,
    replacement: `index.${theme}.html`,
  };
}

function getFileOverlayCacheKey(fileOverlays: FileOverlay[]): string {
  const hash = createHash('sha256');
  const entries = [...fileOverlays].sort((left, right) => left.original.localeCompare(right.original));

  entries.forEach(({ content, original }) => {
    hash.update(original);
    hash.update(content);
  });

  return hash.digest('hex').slice(0, 12);
}

function getFileMtime(file: string): number {
  return fs.existsSync(file) ? fs.statSync(file).mtimeMs : 0;
}

function touchFile(file: string) {
  if (!fs.existsSync(file)) {
    return;
  }

  const now = new Date();
  fs.utimesSync(file, now, now);
}

function watchThemeReplacementFiles(
  resourceReplacements: Record<string, string>,
  angularReplacements: AngularFileReplacement[]
): () => void {
  const resourceReplacementEntries = Object.entries(resourceReplacements);
  const angularReplacementEntries = angularReplacements
    .map(({ replace, with: replacement }) => [replace, replacement] as const)
    .filter(
      ([original, replacement]) =>
        SUPPORTED_REPLACEMENT_EXTENSION.test(original) && SUPPORTED_REPLACEMENT_EXTENSION.test(replacement)
    );
  const replacementEntries = [...resourceReplacementEntries, ...angularReplacementEntries].filter(
    ([original, replacement], index, entries) =>
      entries.findIndex(
        ([entryOriginal, entryReplacement]) => entryOriginal === original && entryReplacement === replacement
      ) === index
  );

  if (!replacementEntries.length) {
    return () => undefined;
  }

  const modificationTimes = new Map(
    replacementEntries.map(([, replacement]) => [replacement, getFileMtime(replacement)])
  );

  const timer = setInterval(() => {
    replacementEntries.forEach(([original, replacement]) => {
      const previousMtime = modificationTimes.get(replacement) || 0;
      const nextMtime = getFileMtime(replacement);

      if (nextMtime === previousMtime) {
        return;
      }

      modificationTimes.set(replacement, nextMtime);

      if (!nextMtime) {
        console.warn(
          `serve:application-dev: watched theme replacement disappeared, keeping previous build input: ${replacement}`
        );
        return;
      }

      if (resourceReplacements[original] === replacement) {
        fs.copyFileSync(replacement, original);
        console.log(`serve:application-dev: updated theme resource overlay ${replacement} -> ${original}`);
      } else {
        touchFile(original);
        console.log(`serve:application-dev: detected theme file replacement update ${replacement}`);
      }
    });
  }, 500);

  return () => clearInterval(timer);
}

async function createArchitectWorkspace(
  workspace: AngularWorkspace,
  buildProjectName: string,
  buildTargetName: string,
  theme: string,
  buildMode: string,
  fileOverlayCacheKey: string
): Promise<workspaces.WorkspaceDefinition> {
  const workspaceHost = workspaces.createWorkspaceHost(new NodeJsSyncHost());
  const { workspace: architectWorkspace } = await workspaces.readWorkspace(WORKSPACE_PATH, workspaceHost);
  const projectDefinition = architectWorkspace.projects.get(buildProjectName);
  const buildTarget = workspace.projects[buildProjectName].architect?.[buildTargetName];

  if (!projectDefinition || !buildTarget?.builder || !buildTarget.options) {
    throw new Error(`Could not prepare build target '${buildProjectName}:${buildTargetName}'.`);
  }

  const cli = JSON.parse(JSON.stringify(workspace.cli || {})) as json.JsonValue;
  const themedBuildTarget = JSON.parse(JSON.stringify(buildTarget)) as AngularWorkspaceTarget;
  applyThemePlaceholder(cli, theme);
  applyThemePlaceholder(themedBuildTarget, theme);

  architectWorkspace.extensions.cli = {
    ...(cli as json.JsonObject),
    cache: {
      ...(((cli as json.JsonObject).cache as json.JsonObject | undefined) || {}),
      path: getDevServerCachePath(buildTargetName, theme, buildMode, fileOverlayCacheKey),
    },
  };
  projectDefinition.targets.set(buildTargetName, {
    builder: themedBuildTarget.builder,
    configurations: (themedBuildTarget.configurations || {}) as Record<string, json.JsonObject>,
    defaultConfiguration: themedBuildTarget.defaultConfiguration,
    options: themedBuildTarget.options as Record<string, json.JsonValue | undefined>,
  });

  return architectWorkspace;
}

function applyThemeFileReplacements(buildContext: BuildContext): ThemeReplacementContext {
  const { availableThemes, theme } = resolveThemeBuildContext(buildContext.buildConfigurationOptions, {
    configuration: toThemeContextConfiguration(buildContext.buildConfiguration),
    project: buildContext.buildTarget.project,
    target: buildContext.buildTarget.target,
  });
  const themeFileReplacements = resolveThemeFileReplacements(theme, availableThemes);
  const angularFileReplacements = toAngularFileReplacements(themeFileReplacements);
  const resourceReplacements = buildResourceReplacements(themeFileReplacements);

  buildContext.buildConfigurationOptions.fileReplacements = mergeFileReplacements(
    buildContext.buildConfigurationOptions.fileReplacements,
    angularFileReplacements
  );

  return { angularFileReplacements, resourceReplacements, theme };
}

async function waitForDevServer(builderRun: BuilderRun) {
  return new Promise<void>((resolve, reject) => {
    let stopped = false;

    const stop = async () => {
      if (stopped) {
        return;
      }

      stopped = true;
      process.off('SIGINT', stop);
      process.off('SIGTERM', stop);
      await builderRun.stop();
      resolve();
    };

    builderRun.output.subscribe({
      error: reject,
      complete: resolve,
      next: result => {
        if (!result.success) {
          reject(new Error('Angular dev server failed.'));
        }
      },
    });

    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  });
}

function writeDryRunOutput(
  projectName: string,
  serveConfiguration: string,
  buildContext: BuildContext,
  serveOverrides: Record<string, json.JsonValue>,
  themeReplacements: ThemeReplacementContext
) {
  const fileOverlays = [
    createThemedIndexOverlay(themeReplacements.theme),
    ...createResourceFileOverlays(themeReplacements.resourceReplacements),
  ];
  const cachePath = getDevServerCachePath(
    buildContext.buildTarget.target,
    themeReplacements.theme,
    getBuildMode(buildContext.buildConfiguration),
    getFileOverlayCacheKey(fileOverlays)
  );

  console.log(
    JSON.stringify(
      {
        serveTarget: `${projectName}:serve:${serveConfiguration}`,
        buildTarget: `${buildContext.buildTarget.project}:${buildContext.buildTarget.target}:${buildContext.buildConfiguration}`,
        theme: themeReplacements.theme,
        cachePath,
        serveOverrides,
        styles: buildContext.buildConfigurationOptions.styles,
        assets: buildContext.buildConfigurationOptions.assets,
        stylePreprocessorOptions: buildContext.buildConfigurationOptions.stylePreprocessorOptions,
        fileReplacements: buildContext.buildConfigurationOptions.fileReplacements,
        resourceReplacements: themeReplacements.resourceReplacements,
      },
      undefined,
      2
    )
  );
}

async function run() {
  const workspace = readWorkspace();
  const projectName = getDefaultProjectName(workspace);
  const parsedArgs = parseArgs(process.argv.slice(2));
  const serveConfiguration = getServeConfiguration(workspace, projectName, parsedArgs.configuration);
  const buildContext = getBuildContext(workspace, projectName, serveConfiguration);
  const serveOverrides = withDevServerDefaults(parsedArgs.overrides);
  const themeReplacements = applyThemeFileReplacements(buildContext);
  const fileOverlays = createResourceFileOverlays(themeReplacements.resourceReplacements);
  const cachePath = getDevServerCachePath(
    buildContext.buildTarget.target,
    themeReplacements.theme,
    getBuildMode(buildContext.buildConfiguration),
    getFileOverlayCacheKey(fileOverlays)
  );
  themeReplacements.cachePath = cachePath;

  if (parsedArgs.dryRun) {
    writeDryRunOutput(projectName, serveConfiguration, buildContext, serveOverrides, themeReplacements);
    return;
  }

  const architectWorkspace = await createArchitectWorkspace(
    workspace,
    buildContext.buildTarget.project,
    buildContext.buildTarget.target,
    themeReplacements.theme,
    getBuildMode(buildContext.buildConfiguration),
    getFileOverlayCacheKey(fileOverlays)
  );
  const architectHost = new WorkspaceNodeModulesArchitectHost(architectWorkspace, process.cwd());
  const architect = new Architect(architectHost);
  const logger$ = createConsoleLogger(false, process.stdout, process.stderr);
  const restoreOverlay = applyFileOverlays(fileOverlays);
  const stopReplacementWatcher = watchThemeReplacementFiles(
    themeReplacements.resourceReplacements,
    themeReplacements.angularFileReplacements
  );

  console.log(`serve:application-dev: serving ${themeReplacements.theme} via ${buildContext.buildConfiguration}`);
  console.log(`serve:application-dev: cache path ${cachePath}`);
  console.log(
    `serve:application-dev: using ${themeReplacements.angularFileReplacements.length} Angular file replacements and ${Object.keys(themeReplacements.resourceReplacements).length} resource overlays`
  );

  try {
    const builderRun = await architect.scheduleTarget(
      { project: projectName, target: 'serve', configuration: serveConfiguration },
      serveOverrides,
      { logger: logger$ }
    );

    await waitForDevServer(builderRun);
  } finally {
    stopReplacementWatcher();
    restoreOverlay();
  }
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
