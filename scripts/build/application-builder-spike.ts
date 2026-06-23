import { tsquery } from '@phenomnomnominal/tsquery';
import { spawn, spawnSync } from 'child_process';
import { createHash } from 'crypto';
import * as fs from 'fs';
import { basename, dirname, isAbsolute, join, normalize, relative, resolve } from 'path';
import { PurgeCSS } from 'purgecss';
import * as ts from 'typescript';

import {
  ANGULAR_CACHE_DIR,
  buildResourceReplacements,
  resolveThemeBuildContext,
  resolveThemeFileReplacements,
  toRelativeReplacements,
  writeReplacementsJson,
} from './theme-resolver';

/* eslint-disable max-lines, no-console */

interface AngularWorkspaceTarget {
  configurations?: Record<string, Record<string, unknown>>;
  defaultConfiguration?: string;
  options?: Record<string, unknown>;
}

interface AngularWorkspaceProject {
  architect?: Record<string, AngularWorkspaceTarget>;
  root?: string;
}

interface AngularWorkspace {
  cli?: {
    cache?: Record<string, unknown>;
  };
  projects: Record<string, AngularWorkspaceProject>;
}

interface PackageJson {
  version: string;
}

interface AngularFileReplacement {
  replace: string;
  with: string;
}

interface PurgeCssReport {
  bytesAfter: number;
  bytesBefore: number;
  bytesRemoved: number;
  contentFiles: number;
  enabled: boolean;
  files: number;
  mode: 'disabled' | 'safe' | 'strict';
  rejectedSelectors: number;
}

interface FileOverlay {
  content: Buffer | string;
  original: string;
}

interface AngularDeclarationMetadata {
  kind: 'Component' | 'Directive' | 'Pipe';
  token: string;
}

interface ReplacementReport {
  angularFileReplacements: AngularFileReplacement[];
  configuration: string;
  dataTestingIdTemplatesStripped: number;
  generatedIndex: string;
  note: string;
  production: boolean;
  purgeCss: PurgeCssReport;
  resourceOverlayApplied: boolean;
  resourceReplacements: Record<string, string>;
  serviceWorker: boolean;
  theme: string;
}

const RUNNER_CONSTANTS: Readonly<Record<string, string>> = {
  generatedBasePath:
    process.env.APPLICATION_BUILDER_GENERATED_BASE_PATH || join('node_modules', '.cache', 'application-spike'),
  outputBasePath: process.env.APPLICATION_BUILDER_OUTPUT_BASE_PATH || join('dist', 'application-spike'),
  runnerLabel: process.env.APPLICATION_BUILDER_RUNNER_LABEL || 'build-application-spike',
  spikeTarget: process.env.APPLICATION_BUILDER_TARGET || 'build-application-spike',
  versionLabel: process.env.APPLICATION_BUILDER_VERSION_LABEL || 'application-builder-spike',
  themeEnvironmentReplacement: 'src/environments/environment.ts',
  workspaceBackupPath:
    process.env.APPLICATION_BUILDER_WORKSPACE_BACKUP_PATH ||
    join('node_modules', '.cache', 'application-spike', 'angular.original.json'),
  workspacePath: 'angular.json',
};

const SERVER_ALLOWED_COMMON_JS_DEPENDENCIES = [
  '@elastic/ecs-pino-format',
  'express-http-proxy',
  'on-finished',
  'pino',
  'pino-pretty',
  'prom-client',
  'undici',
];

const APPLICATION_BUILDER_POLYFILLS = ['@angular/localize/init'];

const DATA_TESTING_ID_TEMPLATE_ROOTS = ['src', 'projects'];

const ACTIVE_FILES_TEMPLATE_ROOTS = ['src', 'projects'];

const PURGE_CSS_CONTENT_ROOTS = ['src', 'projects'];

const PURGE_CSS_IGNORE_CLASS_SELECTOR = /(^|[^\\\w-])\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;

const PURGE_CSS_IGNORE_ID_SELECTOR = /(^|[^\\\w-])#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;

const PURGE_CSS_IGNORE_TOKEN_SKIP_LIST = new Set([
  'active',
  'bi',
  'disabled',
  'focus',
  'hidden',
  'hover',
  'open',
  'selected',
  'show',
]);

const PURGE_CSS_DISABLED_REPORT: PurgeCssReport = {
  bytesAfter: 0,
  bytesBefore: 0,
  bytesRemoved: 0,
  contentFiles: 0,
  enabled: false,
  files: 0,
  mode: 'disabled',
  rejectedSelectors: 0,
};

const SUPPORTED_REPLACEMENT_EXTENSION = /\.(([cm]?[jt])sx?|json)$/;

let activeFilesTemplateContentCache: string | undefined;

function getPurgeCssMode(production: boolean): 'disabled' | 'safe' | 'strict' {
  if (!production) {
    return 'disabled';
  }

  const value = (process.env.APPLICATION_BUILDER_PURGE_CSS || '').toLowerCase();
  if (/^(off|0|false|no)$/i.test(value)) {
    return 'disabled';
  }

  return value === 'safe' ? 'safe' : 'strict';
}

function readJsonFile<T>(path: string): T {
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' })) as T;
}

function getDefaultProjectName(workspace: AngularWorkspace): string {
  const projectName = Object.keys(workspace.projects).find(project => workspace.projects[project].root === '');
  if (!projectName) {
    throw new Error('Could not determine default Angular project with root "".');
  }
  return projectName;
}

function isTemporarySpikeWorkspace(workspace: AngularWorkspace): boolean {
  const projectName = getDefaultProjectName(workspace);
  const target = workspace.projects[projectName].architect?.[RUNNER_CONSTANTS.spikeTarget];
  const index = target?.options?.index;

  return (
    !!target &&
    Object.keys(target.configurations || {}).length === 0 &&
    typeof index === 'object' &&
    !!index &&
    typeof (index as { input?: unknown }).input === 'string' &&
    (index as { input: string }).input.includes(RUNNER_CONSTANTS.generatedBasePath.replace(/\\/g, '/'))
  );
}

function readWorkspaceTextWithRecovery(): string {
  const workspaceText = fs.readFileSync(RUNNER_CONSTANTS.workspacePath, { encoding: 'utf-8' });
  const workspace = JSON.parse(workspaceText) as AngularWorkspace;

  if (isTemporarySpikeWorkspace(workspace) && fs.existsSync(RUNNER_CONSTANTS.workspaceBackupPath)) {
    const backupWorkspaceText = fs.readFileSync(RUNNER_CONSTANTS.workspaceBackupPath, { encoding: 'utf-8' });
    fs.writeFileSync(RUNNER_CONSTANTS.workspacePath, backupWorkspaceText);
    return backupWorkspaceText;
  }

  return workspaceText;
}

function writeWorkspaceBackup(workspaceText: string) {
  fs.mkdirSync(RUNNER_CONSTANTS.generatedBasePath, { recursive: true });
  fs.writeFileSync(RUNNER_CONSTANTS.workspaceBackupPath, workspaceText);
}

function normalizeConfigurationArgument(configuration?: string): string | undefined {
  const normalizedConfiguration = configuration?.trim();
  const npmSplitConfiguration = /^([a-z0-9_-]+)\s+(development|production)$/i.exec(normalizedConfiguration || '');

  return npmSplitConfiguration ? `${npmSplitConfiguration[1]},${npmSplitConfiguration[2]}` : normalizedConfiguration;
}

function getNpmConfigFlag(name: string): boolean {
  return /^(true|1)$/i.test(process.env[`npm_config_${name}`] || '');
}

function getEnvironmentFlag(name: string): boolean {
  return /^(true|1|on|yes)$/i.test(process.env[name] || '');
}

function getConfigurationArgument(args: string[]): { configuration?: string; remainingArgs: string[] } {
  const remainingArgs: string[] = [];
  let configuration = normalizeConfigurationArgument(process.env.npm_config_configuration);

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--configuration' || arg === '-c') {
      configuration = normalizeConfigurationArgument(args[index + 1]);
      index++;
    } else if (arg.startsWith('--configuration=')) {
      configuration = normalizeConfigurationArgument(arg.split('=')[1]);
    } else if (arg.startsWith('-c=')) {
      configuration = normalizeConfigurationArgument(arg.split('=')[1]);
    } else {
      remainingArgs.push(arg);
    }
  }

  if (getNpmConfigFlag('source_map') && !remainingArgs.some(arg => arg.startsWith('--source-map'))) {
    remainingArgs.push('--source-map');
  }

  if (configuration === 'true') {
    throw new Error('it seems you missed the equal sign in "--configuration=<config>"');
  }

  return { configuration, remainingArgs };
}

function withoutFileReplacements(configuration: Record<string, unknown> = {}): Record<string, unknown> {
  const rest = { ...configuration };
  delete rest.fileReplacements;
  return rest;
}

function isAngularFileReplacement(value: unknown): value is AngularFileReplacement {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as Partial<AngularFileReplacement>).replace === 'string' &&
    typeof (value as Partial<AngularFileReplacement>).with === 'string'
  );
}

function getModeFileReplacements(configuration: Record<string, unknown> = {}): AngularFileReplacement[] {
  const fileReplacements = configuration.fileReplacements;
  if (!Array.isArray(fileReplacements)) {
    return [];
  }
  return fileReplacements
    .filter(isAngularFileReplacement)
    .filter(replacement => replacement.replace !== RUNNER_CONSTANTS.themeEnvironmentReplacement);
}

function getModeBuilderOptions(
  production: boolean,
  configuration: Record<string, unknown> = {}
): Record<string, unknown> {
  const options = withoutFileReplacements(configuration);
  if (production) {
    return {
      ...options,
      optimization: {
        fonts: false,
        scripts: true,
        styles: {
          inlineCritical: false,
          minify: true,
        },
      },
    };
  }
  return {
    ...options,
    budgets: [
      {
        maximumWarning: '6kb',
        type: 'anyComponentStyle',
      },
    ],
    extractLicenses: false,
    namedChunks: true,
    optimization: false,
    sourceMap: true,
  };
}

function getAllowedCommonJsDependencies(options: Record<string, unknown>): string[] {
  const existing = options.allowedCommonJsDependencies;
  const existingDependencies = Array.isArray(existing)
    ? existing.filter((dependency): dependency is string => typeof dependency === 'string')
    : [];

  return [...new Set([...existingDependencies, ...SERVER_ALLOWED_COMMON_JS_DEPENDENCIES])];
}

function getApplicationBuilderPolyfills(options: Record<string, unknown>): string[] {
  const existing = options.polyfills;
  const existingPolyfills = Array.isArray(existing)
    ? existing.filter((polyfill): polyfill is string => typeof polyfill === 'string')
    : [];

  return [...new Set([...APPLICATION_BUILDER_POLYFILLS, ...existingPolyfills])];
}

function toAngularFileReplacements(fileReplacements: Record<string, string>, workspaceRoot = process.cwd()) {
  return Object.entries(toRelativeReplacements(fileReplacements, workspaceRoot))
    .filter(
      ([original, replacement]) =>
        SUPPORTED_REPLACEMENT_EXTENSION.test(original) && SUPPORTED_REPLACEMENT_EXTENSION.test(replacement)
    )
    .map(([replace, withPath]) => ({ replace, with: withPath }));
}

function toDiagnosticReplacements(fileReplacements: Record<string, string>, workspaceRoot = process.cwd()) {
  const relativeReplacements = toRelativeReplacements(fileReplacements, workspaceRoot);
  return Object.fromEntries(
    Object.entries(relativeReplacements).filter(
      ([original, replacement]) =>
        !SUPPORTED_REPLACEMENT_EXTENSION.test(original) || !SUPPORTED_REPLACEMENT_EXTENSION.test(replacement)
    )
  );
}

function createDefineValues(configuration: string, theme: string, production: boolean, serviceWorker: boolean) {
  const version = readJsonFile<PackageJson>('package.json').version;
  const ngrxRuntimeChecks = getEnvironmentFlag('TESTING') || !production;

  return {
    NGRX_RUNTIME_CHECKS: JSON.stringify(ngrxRuntimeChecks),
    PRODUCTION_MODE: JSON.stringify(production),
    PWA_VERSION: JSON.stringify(
      `${version} ${RUNNER_CONSTANTS.versionLabel} - configuration:${configuration} service-worker:${serviceWorker}`
    ),
    SERVICE_WORKER: JSON.stringify(serviceWorker),
    SSR: 'globalThis.ngServerMode',
    THEME: JSON.stringify(theme),
  };
}

function getApplicationOutputPath(options: Record<string, unknown>): Record<string, string> {
  const outputPath = options.outputPath;
  const outputPathObject = outputPath && typeof outputPath === 'object' ? (outputPath as Record<string, unknown>) : {};

  return {
    ...Object.fromEntries(
      Object.entries(outputPathObject).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    ),
    base: RUNNER_CONSTANTS.outputBasePath,
    browser: 'browser',
    server: 'server',
  };
}

function getThemeColor(theme: string): string | undefined {
  const manifestPath = join('src', 'assets', 'themes', theme, 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    return;
  }
  const manifest = readJsonFile<{ theme_color?: string }>(manifestPath);
  return manifest.theme_color;
}

function writeThemedIndex(theme: string): string {
  fs.mkdirSync(RUNNER_CONSTANTS.generatedBasePath, { recursive: true });
  const indexPath = join(RUNNER_CONSTANTS.generatedBasePath, `index.${theme}.html`);
  const themeColor = getThemeColor(theme);
  let index = fs.readFileSync('src/index.html', { encoding: 'utf-8' });

  index = index.replace(/assets\/themes\/[^/]+/g, `assets/themes/${theme}`).replace(/theme_placeholder/g, theme);
  if (themeColor) {
    index = index.replace(
      /<meta content="[^"]+" name="theme-color" \/>/,
      `<meta content="${themeColor}" name="theme-color" />`
    );
  }

  fs.writeFileSync(indexPath, index);
  return indexPath.replace(/\\/g, '/');
}

function applyThemeToIndexHtml(indexPath: string, theme: string) {
  if (!fs.existsSync(indexPath)) {
    return;
  }

  const themeColor = getThemeColor(theme);
  let index = fs.readFileSync(indexPath, { encoding: 'utf-8' });
  index = index.replace(/assets\/themes\/[^/]+/g, `assets/themes/${theme}`).replace(/theme_placeholder/g, theme);
  if (themeColor) {
    index = index.replace(
      /<meta content="[^"]+" name="theme-color"\s*\/?>/,
      `<meta content="${themeColor}" name="theme-color">`
    );
  }
  fs.writeFileSync(indexPath, index);
}

function applyThemeToOutputIndexFiles(theme: string) {
  const browserOutputPath = join(RUNNER_CONSTANTS.outputBasePath, 'browser');
  const indexPath = join(browserOutputPath, 'index.html');
  const csrIndexPath = join(browserOutputPath, 'index.csr.html');

  if (!fs.existsSync(indexPath) && fs.existsSync(csrIndexPath)) {
    fs.copyFileSync(csrIndexPath, indexPath);
  }

  ['index.html', 'index.csr.html', 'index.server.html'].forEach(indexFile =>
    applyThemeToIndexHtml(join(browserOutputPath, indexFile), theme)
  );
}

function watchOutputIndexFiles(theme: string): () => void {
  const browserOutputPath = join(RUNNER_CONSTANTS.outputBasePath, 'browser');
  const indexPath = join(browserOutputPath, 'index.html');
  const csrIndexPath = join(browserOutputPath, 'index.csr.html');
  const indexFiles = ['index.html', 'index.csr.html', 'index.server.html'].map(indexFile =>
    join(browserOutputPath, indexFile)
  );
  const timestamps = new Map<string, number>();
  const updateTimestamps = () => {
    indexFiles.forEach(indexFile => {
      if (fs.existsSync(indexFile)) {
        timestamps.set(indexFile, fs.statSync(indexFile).mtimeMs);
      } else {
        timestamps.delete(indexFile);
      }
    });
  };

  const timer = setInterval(() => {
    restoreDistRootSupportFiles();

    let changed = false;
    indexFiles.forEach(indexFile => {
      if (!fs.existsSync(indexFile)) {
        timestamps.delete(indexFile);
        return;
      }
      const mtime = fs.statSync(indexFile).mtimeMs;
      const previous = timestamps.get(indexFile);
      timestamps.set(indexFile, mtime);
      if (previous !== undefined && previous !== mtime) {
        changed = true;
      }
    });

    if (changed || (!fs.existsSync(indexPath) && fs.existsSync(csrIndexPath))) {
      applyThemeToOutputIndexFiles(theme);
      updateTimestamps();
    }
  }, 1000);

  return () => clearInterval(timer);
}

function getResourceOverlayReplacements(fileReplacements: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fileReplacements).filter(
      ([original, replacement]) =>
        !SUPPORTED_REPLACEMENT_EXTENSION.test(original) || !SUPPORTED_REPLACEMENT_EXTENSION.test(replacement)
    )
  );
}

function getFileOverlayCacheKey(fileOverlays: FileOverlay[]): string {
  const hash = createHash('sha256');
  const entries = [...fileOverlays].sort((left, right) => left.original.localeCompare(right.original));

  if (!entries.length) {
    return 'no-file-overlay';
  }

  entries.forEach(({ content, original }) => {
    hash.update(original);
    hash.update(content);
  });

  return hash.digest('hex').slice(0, 12);
}

function createResourceFileOverlays(resourceReplacements: Record<string, string>): FileOverlay[] {
  return Object.entries(resourceReplacements).map(([original, replacement]) => ({
    content: fs.readFileSync(replacement),
    original,
  }));
}

function stripDataTestingIdAttributes(template: string): string {
  return template.replace(/ ?\[?(attr\.)?data-testing-[a-z-]*?\]?="([^"]*?)"/g, '');
}

function collectHtmlTemplateFiles(path: string): string[] {
  return collectFiles(path).filter(file => file.endsWith('.html'));
}

function createDataTestingIdFileOverlays(production: boolean): FileOverlay[] {
  if (!production || getEnvironmentFlag('TESTING')) {
    return [];
  }

  return DATA_TESTING_ID_TEMPLATE_ROOTS.flatMap(root => collectHtmlTemplateFiles(root))
    .map(original => {
      const template = fs.readFileSync(original, { encoding: 'utf-8' });
      return {
        content: stripDataTestingIdAttributes(template),
        original,
      };
    })
    .filter(({ content, original }) => content !== fs.readFileSync(original, { encoding: 'utf-8' }));
}

function writeDataTestingIdPreloadScript(enabled: boolean): string | undefined {
  if (!enabled) {
    return;
  }

  fs.mkdirSync(RUNNER_CONSTANTS.generatedBasePath, { recursive: true });
  const preloadPath = join(RUNNER_CONSTANTS.generatedBasePath, 'strip-data-testing.cjs');
  fs.writeFileSync(
    preloadPath,
    [
      "'use strict';",
      '',
      "const fs = require('fs');",
      "const path = require('path');",
      '',
      'const workspaceRoot = process.cwd();',
      'const stripPattern = / ?\\[?(attr\\.)?data-testing-[a-z-]*?\\]?="([^"]*?)"/g;',
      '',
      'function shouldStrip(file) {',
      "  if (typeof file !== 'string' || !file.endsWith('.html')) {",
      '    return false;',
      '  }',
      "  const relativePath = path.relative(workspaceRoot, path.resolve(file)).replace(/\\\\/g, '/');",
      "  return relativePath.startsWith('src/') || relativePath.startsWith('projects/');",
      '}',
      '',
      'function strip(value, encoding) {',
      "  const text = Buffer.isBuffer(value) ? value.toString(encoding || 'utf-8') : String(value);",
      "  const stripped = text.replace(stripPattern, '');",
      '  return Buffer.isBuffer(value) && !encoding ? Buffer.from(stripped) : stripped;',
      '}',
      '',
      'const originalReadFileSync = fs.readFileSync;',
      'fs.readFileSync = function patchedReadFileSync(file, options) {',
      '  const result = originalReadFileSync.apply(this, arguments);',
      "  return shouldStrip(file) ? strip(result, typeof options === 'string' ? options : options && options.encoding) : result;",
      '};',
      '',
      'const originalReadFile = fs.readFile;',
      'fs.readFile = function patchedReadFile(file, options, callback) {',
      "  const actualCallback = typeof options === 'function' ? options : callback;",
      "  const actualOptions = typeof options === 'function' ? undefined : options;",
      '  return originalReadFile.call(this, file, actualOptions, (error, data) => {',
      '    if (error || !shouldStrip(file)) {',
      '      actualCallback(error, data);',
      '      return;',
      '    }',
      "    actualCallback(undefined, strip(data, typeof actualOptions === 'string' ? actualOptions : actualOptions && actualOptions.encoding));",
      '  });',
      '};',
      '',
      'const originalPromisesReadFile = fs.promises.readFile;',
      'fs.promises.readFile = async function patchedPromisesReadFile(file, options) {',
      '  const result = await originalPromisesReadFile.call(this, file, options);',
      "  return shouldStrip(file) ? strip(result, typeof options === 'string' ? options : options && options.encoding) : result;",
      '};',
      '',
    ].join('\n')
  );

  return preloadPath;
}

function collectFiles(path: string): string[] {
  if (!fs.existsSync(path)) {
    return [];
  }

  return fs.readdirSync(path).flatMap(file => {
    const filePath = join(path, file);
    return fs.statSync(filePath).isDirectory() ? collectFiles(filePath) : [filePath];
  });
}

function collectPurgeCssContentFiles(): string[] {
  return PURGE_CSS_CONTENT_ROOTS.flatMap(root => collectFiles(root)).filter(file => {
    const normalizedFile = file.replace(/\\/g, '/');
    return normalizedFile.includes('src/app/') && /\.(html|json|scss|ts)$/.test(file) && !file.endsWith('.spec.ts');
  });
}

function getBrowserCssFiles(): string[] {
  return collectFiles(join(RUNNER_CONSTANTS.outputBasePath, 'browser')).filter(
    file => file.endsWith('.css') && !file.endsWith('.css.map')
  );
}

function toPurgeCssPath(path: string): string {
  return path.replace(/\\/g, '/');
}

function toWorkspacePath(path: string): string {
  return path.replace(/\\/g, '/');
}

function resolveWorkspaceSourcePath(
  source: string,
  sourceMapPath: string,
  workspaceRoot = process.cwd()
): string | undefined {
  const normalizedSource = toWorkspacePath(source)
    .replace(/^webpack:\/\//, '')
    .replace(/^ng:\/\//, '')
    .replace(/^file:\/+/, '')
    .replace(/^\.\//, '');
  const directMatch = /(?:^|\/)((?:src|projects)\/.*)$/.exec(normalizedSource);
  if (directMatch) {
    return directMatch[1];
  }

  const absoluteSource = isAbsolute(normalizedSource)
    ? normalizedSource
    : resolve(dirname(sourceMapPath), normalizedSource);
  const relativeSource = toWorkspacePath(relative(workspaceRoot, absoluteSource)).replace(/^(\.\.\/)+/, '');
  const relativeMatch = /^((?:src|projects)\/.*)$/.exec(relativeSource);

  return relativeMatch?.[1];
}

function getSourceMapSources(sourceMapPath: string): string[] {
  const sourceMap = readJsonFile<{ sourceRoot?: string; sources?: string[] }>(sourceMapPath);
  const sources = sourceMap.sources || [];

  return sourceMap.sourceRoot ? sources.flatMap(source => [source, join(sourceMap.sourceRoot || '', source)]) : sources;
}

function normalizeActiveFilePath(path: string): string {
  return toWorkspacePath(normalize(path));
}

function toWorkspaceRelativeActiveFilePath(path: string, workspaceRoot = process.cwd()): string {
  const absolutePath = isAbsolute(path) ? path : resolve(workspaceRoot, path);

  return normalizeActiveFilePath(relative(workspaceRoot, absolutePath));
}

function toActiveFileReplacements(
  fileReplacements: Record<string, string>,
  workspaceRoot = process.cwd()
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fileReplacements).map(([original, replacement]) => [
      toWorkspaceRelativeActiveFilePath(original, workspaceRoot),
      toWorkspaceRelativeActiveFilePath(replacement, workspaceRoot),
    ])
  );
}

function resolveComponentStylePath(componentPath: string, styleUrl: string): string {
  return normalizeActiveFilePath(styleUrl.startsWith('.') ? join(dirname(componentPath), styleUrl) : styleUrl);
}

function collectImportedStyleFiles(stylePath: string, theme: string): string[] {
  const fileWithExtension = stylePath.endsWith('.scss') ? stylePath : `${stylePath}.scss`;
  const scssPath = ['', 'src/styles/', `src/styles/themes/${theme}/`]
    .map(prefix => normalizeActiveFilePath(prefix + fileWithExtension))
    .find(file => fs.existsSync(file));

  if (!scssPath) {
    return [];
  }

  const importedFiles = [...fs.readFileSync(scssPath, { encoding: 'utf-8' }).matchAll(/@import\s+['"]([^'"]+)['"]/g)]
    .map(match => match[1])
    .flatMap(importPath => collectImportedStyleFiles(importPath, theme));

  return [scssPath, ...importedFiles];
}

function expandComponentActiveFiles(
  sourcePath: string,
  theme: string,
  relativeReplacements: Record<string, string>
): string[] {
  if (!basename(sourcePath).includes('.component.') || !sourcePath.endsWith('.ts') || !fs.existsSync(sourcePath)) {
    return [sourcePath];
  }

  const styleFiles = tsquery(
    tsquery.ast(fs.readFileSync(sourcePath, { encoding: 'utf-8' })),
    'CallExpression:has(Identifier[name=Component]) PropertyAssignment:has(Identifier[name=styleUrls]) ArrayLiteralExpression > StringLiteral'
  )
    .map((styleUrl: ts.StringLiteral) => resolveComponentStylePath(sourcePath, styleUrl.text))
    .map(stylePath => relativeReplacements[stylePath] ?? stylePath)
    .flatMap(stylePath => collectImportedStyleFiles(stylePath, theme));

  return [...styleFiles, sourcePath];
}

function resolveTypescriptImportPath(sourcePath: string, importPath: string): string | undefined {
  const resolvedImport = importPath.startsWith('.')
    ? normalizeActiveFilePath(join(dirname(sourcePath), importPath))
    : importPath;
  const candidates = [resolvedImport, `${resolvedImport}.ts`, join(resolvedImport, 'index.ts')];

  return candidates.find(file => fs.existsSync(file));
}

function collectNamedImportPaths(sourcePath: string): Record<string, string> {
  const sourceFile = tsquery.ast(fs.readFileSync(sourcePath, { encoding: 'utf-8' }));
  return tsquery(sourceFile, 'ImportDeclaration').reduce<Record<string, string>>((accumulator, node) => {
    const importDeclaration = node as ts.ImportDeclaration;
    const moduleSpecifier = importDeclaration.moduleSpecifier;
    const importPath = ts.isStringLiteral(moduleSpecifier)
      ? resolveTypescriptImportPath(sourcePath, moduleSpecifier.text)
      : undefined;
    const namedBindings = importDeclaration.importClause?.namedBindings;

    if (importPath && namedBindings && ts.isNamedImports(namedBindings)) {
      namedBindings.elements.forEach(element => {
        accumulator[element.name.text] = importPath;
      });
    }

    return accumulator;
  }, {});
}

function collectArrayIdentifierElements(sourcePath: string): Record<string, string[]> {
  const sourceFile = tsquery.ast(fs.readFileSync(sourcePath, { encoding: 'utf-8' }));
  return tsquery(sourceFile, 'VariableDeclaration').reduce<Record<string, string[]>>((accumulator, node) => {
    const declaration = node as ts.VariableDeclaration;
    const name = declaration.name;
    const initializer = declaration.initializer;

    if (ts.isIdentifier(name) && initializer && ts.isArrayLiteralExpression(initializer)) {
      accumulator[name.text] = initializer.elements.filter(ts.isIdentifier).map(identifier => identifier.text);
    }

    return accumulator;
  }, {});
}

function getActiveFilesTemplateContent(): string {
  if (!activeFilesTemplateContentCache) {
    activeFilesTemplateContentCache = ACTIVE_FILES_TEMPLATE_ROOTS.flatMap(root => collectHtmlTemplateFiles(root))
      .map(file => fs.readFileSync(file, { encoding: 'utf-8' }))
      .join('\n');
  }

  return activeFilesTemplateContentCache;
}

function getAngularDeclarationMetadata(sourcePath: string): AngularDeclarationMetadata | undefined {
  const metadataMatch = /@(Component|Directive|Pipe)\s*\(\s*{[\s\S]*?(?:selector|name)\s*:\s*['"]([^'"]+)['"]/.exec(
    fs.readFileSync(sourcePath, { encoding: 'utf-8' })
  );

  if (!metadataMatch) {
    return;
  }

  return {
    kind: metadataMatch[1] as AngularDeclarationMetadata['kind'],
    token: metadataMatch[2],
  };
}

function isAngularDeclarationUsedInTemplates(sourcePath: string): boolean {
  const metadata = getAngularDeclarationMetadata(sourcePath);
  if (!metadata) {
    return false;
  }

  const templateContent = getActiveFilesTemplateContent();
  const escapedToken = escapeRegExp(metadata.token);

  if (metadata.kind === 'Pipe') {
    return new RegExp(`\\|\\s*${escapedToken}\\b`).test(templateContent);
  }

  if (metadata.token.startsWith('[') && metadata.token.endsWith(']')) {
    return new RegExp(`\\b${escapeRegExp(metadata.token.slice(1, -1))}\\b`).test(templateContent);
  }

  return new RegExp(`<\\s*${escapedToken}\\b`).test(templateContent);
}

function expandNgModuleDeclarationFiles(sourcePath: string): string[] {
  if (!sourcePath.endsWith('.module.ts') || !fs.existsSync(sourcePath)) {
    return [sourcePath];
  }

  const importedFiles = collectNamedImportPaths(sourcePath);
  const arrayIdentifierElements = collectArrayIdentifierElements(sourcePath);
  const sourceFile = tsquery.ast(fs.readFileSync(sourcePath, { encoding: 'utf-8' }));
  const declarationFiles = tsquery(
    sourceFile,
    'CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=declarations]) SpreadElement > Identifier'
  )
    .flatMap((identifier: ts.Identifier) => arrayIdentifierElements[identifier.text] || [])
    .map(identifier => importedFiles[identifier])
    .filter((file): file is string => !!file)
    .filter(isAngularDeclarationUsedInTemplates);

  return [...declarationFiles, sourcePath];
}

function isReportableActiveFile(file: string): boolean {
  return /\.(html|scss|ts)$/.test(file) && !file.endsWith('.spec.ts');
}

function writeActiveFilesReport(theme: string, fileReplacements: Record<string, string>): string | undefined {
  const browserOutputPath = join(RUNNER_CONSTANTS.outputBasePath, 'browser');
  const activeFilesPath = join(browserOutputPath, 'active-files.json');
  const sourceMapFiles = collectFiles(browserOutputPath).filter(file => file.endsWith('.js.map'));

  if (!sourceMapFiles.length) {
    if (fs.existsSync(activeFilesPath)) {
      fs.unlinkSync(activeFilesPath);
    }
    return;
  }

  const relativeReplacements = toActiveFileReplacements(fileReplacements);
  const activeFiles = [
    ...sourceMapFiles
      .flatMap(sourceMapPath =>
        getSourceMapSources(sourceMapPath).map(source => resolveWorkspaceSourcePath(source, sourceMapPath))
      )
      .filter((sourcePath): sourcePath is string => !!sourcePath)
      .map(sourcePath => relativeReplacements[sourcePath] ?? sourcePath)
      .filter(isReportableActiveFile)
      .flatMap(sourcePath => expandNgModuleDeclarationFiles(sourcePath))
      .flatMap(sourcePath => expandComponentActiveFiles(sourcePath, theme, relativeReplacements)),
    ...collectImportedStyleFiles(`src/styles/themes/${theme}/style`, theme),
  ]
    .filter((file, index, files) => files.indexOf(file) === index)
    .sort();

  fs.writeFileSync(activeFilesPath, JSON.stringify(activeFiles, undefined, 2));
  return activeFilesPath;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectPurgeCssStyleFiles(): string[] {
  return PURGE_CSS_CONTENT_ROOTS.flatMap(root => collectFiles(root)).filter(file => file.endsWith('.scss'));
}

function getLineBraceDelta(line: string): number {
  return (line.match(/{/g)?.length || 0) - (line.match(/}/g)?.length || 0);
}

function collectPurgeCssIgnoredBlocks(file: string): string[] {
  const lines = fs.readFileSync(file, { encoding: 'utf-8' }).split(/\r?\n/);
  const blocks: string[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.includes('purgecss start ignore')) {
      const block: string[] = [];
      while (++index < lines.length && !lines[index].includes('purgecss end ignore')) {
        block.push(lines[index]);
      }
      blocks.push(block.join('\n'));
    } else if (line.includes('purgecss ignore')) {
      const block: string[] = [];
      let braceDepth = 0;
      let sawRuleStart = false;

      do {
        const currentLine = lines[index];
        block.push(currentLine);
        braceDepth += getLineBraceDelta(currentLine);
        sawRuleStart ||= currentLine.includes('{');
        index++;
      } while (index < lines.length && (!sawRuleStart || braceDepth > 0));

      index--;
      blocks.push(block.join('\n'));
    }
  }

  return blocks;
}

function collectSelectorTokens(pattern: RegExp, text: string): string[] {
  const tokens: string[] = [];
  let match: null | RegExpExecArray;

  pattern.lastIndex = 0;
  while ((match = pattern.exec(text))) {
    tokens.push(match[2]);
  }

  return tokens;
}

function collectPurgeCssIgnoreSafelist(): RegExp[] {
  const tokens = new Set<string>();
  collectPurgeCssStyleFiles()
    .flatMap(collectPurgeCssIgnoredBlocks)
    .forEach(block => {
      [
        ...collectSelectorTokens(PURGE_CSS_IGNORE_CLASS_SELECTOR, block),
        ...collectSelectorTokens(PURGE_CSS_IGNORE_ID_SELECTOR, block),
      ]
        .filter(token => token.includes('-') || !PURGE_CSS_IGNORE_TOKEN_SKIP_LIST.has(token))
        .forEach(token => tokens.add(token));
    });

  return [...tokens].sort().map(token => new RegExp(escapeRegExp(token)));
}

function createPendingPurgeCssReport(production: boolean): PurgeCssReport {
  const mode = getPurgeCssMode(production);
  if (mode === 'disabled') {
    return PURGE_CSS_DISABLED_REPORT;
  }

  return {
    ...PURGE_CSS_DISABLED_REPORT,
    contentFiles: collectPurgeCssContentFiles().length,
    enabled: true,
    mode,
  };
}

function getPurgeCssSafelist(mode: 'safe' | 'strict') {
  const ignoredSelectors = collectPurgeCssIgnoreSafelist();
  const webpackSafelist = {
    greedy: [
      /\bmodal\b/,
      /\bdrop/,
      /\bswiper\b/,
      /\bcarousel\b/,
      /\bslide\b/,
      /\bnav-tabs\b/,
      /\bnav-link\b/,
      /\bpopover\b/,
      /\brouterlink\b/,
      /\btable\b/,
      /\bng-select\b/,
      /\btoast\b/,
      /\btext-\b/,
      ...ignoredSelectors,
    ],
    standard: [/(?:((m|p)(t|b|s|e|x|y)?(-(sm|md|lg|xl))?-([0-5]|auto))|((w|h)-(25|50|75|100|auto)))/],
  };

  if (mode === 'strict') {
    return webpackSafelist;
  }

  return {
    greedy: [
      ...webpackSafelist.greedy,
      /\baccordion\b/,
      /\bactive\b/,
      /\bactive-search\b/,
      /\bbadge\b/,
      /\bbtn\b/,
      /\bcategory-level/,
      /\bcollapse\b/,
      /\bcollapsed\b/,
      /\bcollapsing\b/,
      /\bdesktop\b/,
      /\bdisabled\b/,
      /\bdropdown/,
      /\bfaded\b/,
      /\bfilter-/,
      /\bfocus\b/,
      /\bform-/,
      /\bhas-error\b/,
      /\bhas-success\b/,
      /\bhighlight-store\b/,
      /\binactive\b/,
      /\binput-group\b/,
      /\blabel-empty\b/,
      /\blink-separator\b/,
      /\bmobile\b/,
      /\bno-value\b/,
      /\bopen\b/,
      /\bpage-/,
      /\bprogress\b/,
      /\bpromotion-/,
      /\brange\b/,
      /\bscaled-up\b/,
      /\bsearch/,
      /\bselected\b/,
      /\bshow\b/,
      /\bsticky-/,
      /\btablet\b/,
      /\bvisually-hidden\b/,
    ],
    standard: [
      ...webpackSafelist.standard,
      /^(bi|bi-[\w-]+)$/,
      /^btn(-[\w-]+)?$/,
      /^col(-[a-z]+)?(-(auto|\d+))?$/,
      /^d(-[a-z]+)?-[\w-]+$/,
      /^justify-content-[\w-]+$/,
      /^offset(-[a-z]+)?-\d+$/,
      /^position-[\w-]+$/,
      /^rounded(-[\w-]+)?$/,
    ],
  };
}

async function purgeCssOutput(production: boolean): Promise<PurgeCssReport> {
  const mode = getPurgeCssMode(production);
  if (mode === 'disabled') {
    return PURGE_CSS_DISABLED_REPORT;
  }

  const cssFiles = getBrowserCssFiles();
  const contentFiles = collectPurgeCssContentFiles();
  const bytesBefore = summarizeFileBytes(cssFiles);

  if (!cssFiles.length || !contentFiles.length) {
    return {
      bytesAfter: bytesBefore,
      bytesBefore,
      bytesRemoved: 0,
      contentFiles: contentFiles.length,
      enabled: true,
      files: cssFiles.length,
      mode,
      rejectedSelectors: 0,
    };
  }

  const purgedCss = await new PurgeCSS().purge({
    content: contentFiles.map(toPurgeCssPath),
    css: cssFiles.map(toPurgeCssPath),
    rejected: true,
    safelist: getPurgeCssSafelist(mode),
  });

  purgedCss.forEach(result => {
    if (result.file) {
      fs.writeFileSync(result.file, result.css);
    }
  });

  const bytesAfter = summarizeFileBytes(cssFiles);
  return {
    bytesAfter,
    bytesBefore,
    bytesRemoved: bytesBefore - bytesAfter,
    contentFiles: contentFiles.length,
    enabled: true,
    files: cssFiles.length,
    mode,
    rejectedSelectors: purgedCss.reduce((sum, result) => sum + (result.rejected?.length || 0), 0),
  };
}

/**
 * Remove Angular's service worker cache check for resources, especially index.html.
 * https://github.com/angular/angular/issues/23613#issuecomment-415886919
 */
function removeServiceWorkerCacheCheck() {
  const serviceWorkerScript = join(RUNNER_CONSTANTS.outputBasePath, 'browser', 'ngsw-worker.js');
  if (!fs.existsSync(serviceWorkerScript)) {
    return;
  }

  const script = fs.readFileSync(serviceWorkerScript, { encoding: 'utf-8' });
  const patchedScript = script.replace('canonicalHash !== cacheBustedHash', 'false');
  if (patchedScript === script) {
    return;
  }

  console.warn(`${RUNNER_CONSTANTS.runnerLabel}: replacing service worker cache check in ${serviceWorkerScript}`);
  fs.writeFileSync(serviceWorkerScript, patchedScript);
}

async function applyPostBuildOptimizations(
  production: boolean,
  remainingArgs: string[],
  theme: string,
  fileReplacements: Record<string, string>,
  report: ReplacementReport
): Promise<void> {
  if (isWatchMode(remainingArgs)) {
    return;
  }

  removeServiceWorkerCacheCheck();
  report.purgeCss = await purgeCssOutput(production);
  const activeFilesPath = writeActiveFilesReport(theme, fileReplacements);
  if (activeFilesPath) {
    console.log(`${RUNNER_CONSTANTS.runnerLabel}: writing ${activeFilesPath}`);
  } else {
    console.warn(`${RUNNER_CONSTANTS.runnerLabel}: skipping active-files report because no JS source maps were found`);
  }
}

function summarizeFileBytes(files: string[]): number {
  return files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
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

function createReplacementReport(
  configuration: string,
  theme: string,
  production: boolean,
  serviceWorker: boolean,
  generatedIndex: string,
  angularFileReplacements: AngularFileReplacement[],
  resourceReplacements: Record<string, string>,
  dataTestingIdTemplatesStripped: number,
  purgeCss: PurgeCssReport
): ReplacementReport {
  return {
    angularFileReplacements,
    configuration,
    dataTestingIdTemplatesStripped,
    generatedIndex,
    note: 'Angular application builder fileReplacements support TS/JS/JSON only. HTML/SCSS replacements are reported here and applied by the spike runner as a temporary prebuild overlay. data-testing-* stripping is applied in-memory through a Node preload in the Angular child process. Webpack keep_classnames=/.*Module$/ is intentionally not migrated: the application builder does not expose a scoped keepNames option, and no runtime dependency on Angular module class names is known.',
    production,
    purgeCss,
    resourceOverlayApplied: Object.keys(resourceReplacements).length > 0,
    resourceReplacements,
    serviceWorker,
    theme,
  };
}

function cleanApplicationOutputBasePath(outputBasePath: string) {
  for (const outputChild of ['browser', 'server']) {
    fs.rmSync(join(outputBasePath, outputChild), { force: true, recursive: true });
  }

  for (const diagnosticFile of [
    'effective.angular.json',
    'replacements.json',
    'resource-replacements.json',
    'theme-replacements-report.json',
  ]) {
    fs.rmSync(join(outputBasePath, diagnosticFile), { force: true });
  }
}

function restoreDistRootSupportFiles() {
  if (resolve(RUNNER_CONSTANTS.outputBasePath) !== resolve('dist')) {
    return;
  }

  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/.gitignore', '/**/*\n!.gitignore\n!/entrypoint.sh\n!/robots.txt\n');
  fs.writeFileSync(
    'dist/entrypoint.sh',
    [
      '#!/bin/sh',
      '',
      'set -e',
      '',
      'if [ -z "$*" ]',
      'then',
      "  # use 'exec node dist/<theme>/run-standalone'",
      '  # instead of pm2 to fallback to running',
      '  # a single theme only',
      '',
      '  node dist/build-ecosystem.js',
      '  exec pm2-runtime dist/ecosystem.yml',
      'else',
      '  exec "$@"',
      'fi',
      '',
    ].join('\n')
  );
}

function writeDiagnosticFiles(
  workspace: AngularWorkspace,
  fileReplacements: Record<string, string>,
  unsupportedResourceReplacements: Record<string, string>,
  report: ReplacementReport,
  cleanOutput: boolean
) {
  if (cleanOutput) {
    cleanApplicationOutputBasePath(RUNNER_CONSTANTS.outputBasePath);
  }
  fs.mkdirSync(RUNNER_CONSTANTS.outputBasePath, { recursive: true });
  writeReplacementsJson(RUNNER_CONSTANTS.outputBasePath, fileReplacements);
  fs.writeFileSync(
    join(RUNNER_CONSTANTS.outputBasePath, 'resource-replacements.json'),
    JSON.stringify(unsupportedResourceReplacements, undefined, 2)
  );
  fs.writeFileSync(
    join(RUNNER_CONSTANTS.outputBasePath, 'theme-replacements-report.json'),
    JSON.stringify(report, undefined, 2)
  );
  fs.writeFileSync(
    join(RUNNER_CONSTANTS.outputBasePath, 'effective.angular.json'),
    JSON.stringify(workspace, undefined, 2)
  );
}

function isWatchMode(args: string[]): boolean {
  return args.some(arg => arg === '--watch' || arg === '--watch=true');
}

function isStatsJsonMode(args: string[]): boolean {
  return getNpmConfigFlag('stats_json') || args.some(arg => arg === '--stats-json' || arg === '--stats-json=true');
}

function isDryRun(args: string[]): boolean {
  return args.includes('--dry-run') || getNpmConfigFlag('dry_run');
}

function createChildProcessEnv(preloadPath?: string): NodeJS.ProcessEnv {
  if (!preloadPath) {
    return process.env;
  }

  const preloadOption = `--require=${resolve(preloadPath)}`;
  return {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, preloadOption].filter(Boolean).join(' '),
  };
}

function runAngularBuilder(projectName: string, args: string[], theme: string, preloadPath?: string): Promise<void> {
  const commandArgs = ['run', 'ng', '--', 'run', `${projectName}:${RUNNER_CONSTANTS.spikeTarget}`, ...args];
  const env = createChildProcessEnv(preloadPath);

  if (!isWatchMode(args)) {
    const result = spawnSync('npm', commandArgs, { env, shell: process.platform === 'win32', stdio: 'inherit' });
    if (result.status !== 0) {
      throw new Error(`Application builder exited with code ${result.status}.`);
    }
    applyThemeToOutputIndexFiles(theme);
    return Promise.resolve();
  }

  return new Promise((finish, reject) => {
    const stopIndexWatcher = watchOutputIndexFiles(theme);
    const child = spawn('npm', commandArgs, { env, shell: true, stdio: 'inherit' });

    const stopChild = () => {
      child.kill('SIGINT');
    };

    process.once('SIGINT', stopChild);
    process.once('SIGTERM', stopChild);

    child.on('exit', code => {
      stopIndexWatcher();
      process.off('SIGINT', stopChild);
      process.off('SIGTERM', stopChild);

      if (code && code !== 0) {
        reject(new Error(`Application builder exited with code ${code}.`));
      } else {
        finish();
      }
    });
  });
}

async function run() {
  const originalWorkspaceText = readWorkspaceTextWithRecovery();
  const workspace = JSON.parse(originalWorkspaceText) as AngularWorkspace;
  const projectName = getDefaultProjectName(workspace);
  const project = workspace.projects[projectName];
  const target = project.architect?.[RUNNER_CONSTANTS.spikeTarget];

  if (!target?.options) {
    throw new Error(`Could not find target '${projectName}:${RUNNER_CONSTANTS.spikeTarget}'.`);
  }

  const { configuration: requestedConfiguration, remainingArgs } = getConfigurationArgument(process.argv.slice(2));
  const configuration = requestedConfiguration || target.defaultConfiguration || 'b2b,production';
  const mode = configuration.includes('production') ? 'production' : 'development';
  const modeConfiguration = target.configurations?.[mode] || {};
  const dryRun = isDryRun(remainingArgs);
  const { availableThemes, production, theme } = resolveThemeBuildContext(modeConfiguration, {
    configuration,
    project: projectName,
    target: RUNNER_CONSTANTS.spikeTarget,
  });
  const serviceWorker = !!modeConfiguration.serviceWorker;
  const themeFileReplacements = resolveThemeFileReplacements(theme, availableThemes);
  const modeFileReplacements = getModeFileReplacements(modeConfiguration);
  const modeFileReplacementMap = Object.fromEntries(
    modeFileReplacements.map(replacement => [replacement.replace, replacement.with])
  );
  const angularFileReplacements = [...modeFileReplacements, ...toAngularFileReplacements(themeFileReplacements)];
  const activeFileReplacements = { ...modeFileReplacementMap, ...themeFileReplacements };
  const unsupportedResourceReplacements = toDiagnosticReplacements(themeFileReplacements);
  const resourceReplacements = getResourceOverlayReplacements(themeFileReplacements);
  const resourceReplacementReadMap = buildResourceReplacements(themeFileReplacements);
  const resourceFileOverlays = createResourceFileOverlays(resourceReplacements);
  const dataTestingIdFileOverlays = createDataTestingIdFileOverlays(production);
  const dataTestingIdPreloadScript = writeDataTestingIdPreloadScript(dataTestingIdFileOverlays.length > 0);
  const fileOverlays = resourceFileOverlays;
  const fileOverlayCacheKey = getFileOverlayCacheKey([...fileOverlays, ...dataTestingIdFileOverlays]);
  const generatedIndex = writeThemedIndex(theme);
  const report = createReplacementReport(
    configuration,
    theme,
    production,
    serviceWorker,
    generatedIndex,
    angularFileReplacements,
    unsupportedResourceReplacements,
    dataTestingIdFileOverlays.length,
    createPendingPurgeCssReport(production)
  );

  const effectiveOptions = {
    ...target.options,
    ...getModeBuilderOptions(production, modeConfiguration),
    outputPath: getApplicationOutputPath(target.options),
    assets: [
      'src/assets',
      {
        glob: 'favicon.ico',
        input: `src/assets/themes/${theme}/img/`,
        output: '/',
      },
    ],
    allowedCommonJsDependencies: getAllowedCommonJsDependencies(target.options),
    define: createDefineValues(configuration, theme, production, serviceWorker),
    fileReplacements: angularFileReplacements,
    index: {
      input: generatedIndex,
      output: 'index.html',
    },
    polyfills: getApplicationBuilderPolyfills(target.options),
    statsJson: isStatsJsonMode(remainingArgs) || target.options.statsJson,
    stylePreprocessorOptions: {
      ...((target.options.stylePreprocessorOptions as Record<string, unknown>) || {}),
      includePaths: [`src/styles/themes/${theme}`],
    },
    styles: [`src/styles/themes/${theme}/style.scss`],
  };

  project.architect = {
    ...project.architect,
    [RUNNER_CONSTANTS.spikeTarget]: {
      ...target,
      configurations: {},
      defaultConfiguration: undefined,
      options: effectiveOptions,
    },
  };

  workspace.cli = {
    ...workspace.cli,
    cache: {
      ...workspace.cli?.cache,
      path: join(ANGULAR_CACHE_DIR, RUNNER_CONSTANTS.spikeTarget, theme, mode, fileOverlayCacheKey),
    },
  };

  writeDiagnosticFiles(workspace, themeFileReplacements, unsupportedResourceReplacements, report, !dryRun);

  console.log(`${RUNNER_CONSTANTS.runnerLabel}@${configuration}: setting outputPath:`, RUNNER_CONSTANTS.outputBasePath);
  console.log(`${RUNNER_CONSTANTS.runnerLabel}@${configuration}: setting production:`, production);
  console.log(`${RUNNER_CONSTANTS.runnerLabel}@${configuration}: setting serviceWorker:`, serviceWorker);
  console.log(
    `${RUNNER_CONSTANTS.runnerLabel}@${configuration}: setting ngrxRuntimeChecks:`,
    getEnvironmentFlag('TESTING') || !production
  );
  console.log(
    `${RUNNER_CONSTANTS.runnerLabel}@${configuration}: using ${angularFileReplacements.length} Angular file replacements for "${theme}"`
  );
  console.log(
    `${RUNNER_CONSTANTS.runnerLabel}@${configuration}: reporting ${Object.keys(resourceReplacementReadMap).length} resource read aliases and ${Object.keys(resourceReplacements).length} prebuild overlay replacements outside Angular fileReplacements`
  );
  console.log(
    `${RUNNER_CONSTANTS.runnerLabel}@${configuration}: stripping data-testing attributes from ${report.dataTestingIdTemplatesStripped} templates in-memory`
  );
  console.log(`${RUNNER_CONSTANTS.runnerLabel}@${configuration}: setting up purgecss:`, report.purgeCss.enabled);

  if (dryRun) {
    console.log(
      `${RUNNER_CONSTANTS.runnerLabel}@${configuration}: wrote diagnostics to ${RUNNER_CONSTANTS.outputBasePath}`
    );
    return;
  }

  getActiveFilesTemplateContent();
  writeWorkspaceBackup(originalWorkspaceText);
  fs.writeFileSync(RUNNER_CONSTANTS.workspacePath, JSON.stringify(workspace, undefined, 2));
  let buildError: unknown;
  const restoreOverlay = applyFileOverlays(fileOverlays);
  try {
    await runAngularBuilder(projectName, remainingArgs, theme, dataTestingIdPreloadScript);
    restoreDistRootSupportFiles();
    await applyPostBuildOptimizations(production, remainingArgs, theme, activeFileReplacements, report);
  } catch (error) {
    buildError = error;
  } finally {
    restoreOverlay();
    fs.writeFileSync(RUNNER_CONSTANTS.workspacePath, originalWorkspaceText);
    writeDiagnosticFiles(workspace, themeFileReplacements, unsupportedResourceReplacements, report, false);
  }

  if (buildError) {
    throw buildError;
  }
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
