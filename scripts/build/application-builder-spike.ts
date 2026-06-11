import { execSync, spawn } from 'child_process';
import { createHash } from 'crypto';
import * as fs from 'fs';
import { join } from 'path';

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

interface ReplacementReport {
  angularFileReplacements: AngularFileReplacement[];
  configuration: string;
  generatedIndex: string;
  note: string;
  production: boolean;
  resourceOverlayApplied: boolean;
  resourceReplacements: Record<string, string>;
  serviceWorker: boolean;
  theme: string;
}

const RUNNER_CONSTANTS: Readonly<Record<string, string>> = {
  generatedBasePath: join('node_modules', '.cache', 'application-spike'),
  outputBasePath: join('dist', 'application-spike'),
  spikeTarget: 'build-application-spike',
  themeEnvironmentReplacement: 'src/environments/environment.ts',
  workspaceBackupPath: join('node_modules', '.cache', 'application-spike', 'angular.original.json'),
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

const SUPPORTED_REPLACEMENT_EXTENSION = /\.(([cm]?[jt])sx?|json)$/;

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
    (index as { input: string }).input.includes('application-spike')
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

function getConfigurationArgument(args: string[]): { configuration?: string; remainingArgs: string[] } {
  const remainingArgs: string[] = [];
  let configuration = process.env.npm_config_configuration;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--configuration' || arg === '-c') {
      configuration = args[index + 1];
      index++;
    } else if (arg.startsWith('--configuration=')) {
      configuration = arg.split('=')[1];
    } else if (arg.startsWith('-c=')) {
      configuration = arg.split('=')[1];
    } else {
      remainingArgs.push(arg);
    }
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
  const ngrxRuntimeChecks = !!process.env.TESTING || !production;

  return {
    NGRX_RUNTIME_CHECKS: JSON.stringify(ngrxRuntimeChecks),
    PRODUCTION_MODE: JSON.stringify(production),
    PWA_VERSION: JSON.stringify(
      `${version} application-builder-spike - configuration:${configuration} service-worker:${serviceWorker}`
    ),
    SERVICE_WORKER: JSON.stringify(serviceWorker),
    SSR: 'globalThis.ngServerMode',
    THEME: JSON.stringify(theme),
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
  const indexFiles = ['index.html', 'index.csr.html', 'index.server.html'].map(indexFile =>
    join(browserOutputPath, indexFile)
  );
  const timestamps = new Map<string, number>();

  const timer = setInterval(() => {
    const changed = indexFiles.some(indexFile => {
      if (!fs.existsSync(indexFile)) {
        return false;
      }
      const mtime = fs.statSync(indexFile).mtimeMs;
      const previous = timestamps.get(indexFile);
      timestamps.set(indexFile, mtime);
      return previous !== undefined && previous !== mtime;
    });

    if (changed) {
      applyThemeToOutputIndexFiles(theme);
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

function getResourceOverlayCacheKey(resourceReplacements: Record<string, string>): string {
  const hash = createHash('sha256');
  const entries = Object.entries(resourceReplacements).sort(([left], [right]) => left.localeCompare(right));

  if (!entries.length) {
    return 'no-resource-overlay';
  }

  entries.forEach(([original, replacement]) => {
    hash.update(original);
    hash.update(replacement);
    hash.update(fs.readFileSync(replacement));
  });

  return hash.digest('hex').slice(0, 12);
}

function applyResourceOverlay(resourceReplacements: Record<string, string>): () => void {
  const backups = Object.entries(resourceReplacements).map(([original, replacement]) => ({
    content: fs.readFileSync(original),
    original,
    replacement,
  }));

  backups.forEach(({ original, replacement }) => {
    fs.copyFileSync(replacement, original);
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
  resourceReplacements: Record<string, string>
): ReplacementReport {
  return {
    angularFileReplacements,
    configuration,
    generatedIndex,
    note: 'Angular application builder fileReplacements support TS/JS/JSON only. HTML/SCSS replacements are reported here and applied by the spike runner as a temporary prebuild overlay.',
    production,
    resourceOverlayApplied: Object.keys(resourceReplacements).length > 0,
    resourceReplacements,
    serviceWorker,
    theme,
  };
}

function writeDiagnosticFiles(
  workspace: AngularWorkspace,
  fileReplacements: Record<string, string>,
  unsupportedResourceReplacements: Record<string, string>,
  report: ReplacementReport,
  cleanOutput: boolean
) {
  if (cleanOutput) {
    fs.rmSync(RUNNER_CONSTANTS.outputBasePath, { force: true, recursive: true });
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

function runAngularBuilder(projectName: string, args: string[], theme: string): Promise<void> {
  const commandArgs = ['run', 'ng', '--', 'run', `${projectName}:${RUNNER_CONSTANTS.spikeTarget}`, ...args];

  if (!isWatchMode(args)) {
    execSync(`npm ${commandArgs.join(' ')}`, { stdio: 'inherit' });
    applyThemeToOutputIndexFiles(theme);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const stopIndexWatcher = watchOutputIndexFiles(theme);
    const child = spawn('npm', commandArgs, { shell: true, stdio: 'inherit' });

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
        resolve();
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
  const dryRun = remainingArgs.includes('--dry-run');
  const { availableThemes, production, theme } = resolveThemeBuildContext(modeConfiguration, {
    configuration,
    project: projectName,
    target: RUNNER_CONSTANTS.spikeTarget,
  });
  const serviceWorker = !!modeConfiguration.serviceWorker;
  const themeFileReplacements = resolveThemeFileReplacements(theme, availableThemes);
  const angularFileReplacements = [
    ...getModeFileReplacements(modeConfiguration),
    ...toAngularFileReplacements(themeFileReplacements),
  ];
  const unsupportedResourceReplacements = toDiagnosticReplacements(themeFileReplacements);
  const resourceReplacements = getResourceOverlayReplacements(themeFileReplacements);
  const resourceReplacementReadMap = buildResourceReplacements(themeFileReplacements);
  const resourceOverlayCacheKey = getResourceOverlayCacheKey(resourceReplacements);
  const generatedIndex = writeThemedIndex(theme);
  const report = createReplacementReport(
    configuration,
    theme,
    production,
    serviceWorker,
    generatedIndex,
    angularFileReplacements,
    unsupportedResourceReplacements
  );

  const effectiveOptions = {
    ...target.options,
    ...getModeBuilderOptions(production, modeConfiguration),
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
      path: join(ANGULAR_CACHE_DIR, RUNNER_CONSTANTS.spikeTarget, theme, mode, resourceOverlayCacheKey),
    },
  };

  writeDiagnosticFiles(workspace, themeFileReplacements, unsupportedResourceReplacements, report, !dryRun);

  console.log(`${RUNNER_CONSTANTS.spikeTarget}@${configuration}: setting production:`, production);
  console.log(`${RUNNER_CONSTANTS.spikeTarget}@${configuration}: setting serviceWorker:`, serviceWorker);
  console.log(
    `${RUNNER_CONSTANTS.spikeTarget}@${configuration}: setting ngrxRuntimeChecks:`,
    !!process.env.TESTING || !production
  );
  console.log(
    `${RUNNER_CONSTANTS.spikeTarget}@${configuration}: using ${angularFileReplacements.length} Angular file replacements for "${theme}"`
  );
  console.log(
    `${RUNNER_CONSTANTS.spikeTarget}@${configuration}: reporting ${Object.keys(resourceReplacementReadMap).length} resource read aliases and ${Object.keys(resourceReplacements).length} prebuild overlay replacements outside Angular fileReplacements`
  );

  if (dryRun) {
    console.log(
      `${RUNNER_CONSTANTS.spikeTarget}@${configuration}: wrote diagnostics to ${RUNNER_CONSTANTS.outputBasePath}`
    );
    return;
  }

  writeWorkspaceBackup(originalWorkspaceText);
  fs.writeFileSync(RUNNER_CONSTANTS.workspacePath, JSON.stringify(workspace, undefined, 2));
  let buildError: unknown;
  const restoreOverlay = applyResourceOverlay(resourceReplacements);
  try {
    await runAngularBuilder(projectName, remainingArgs, theme);
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
