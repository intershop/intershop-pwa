import { execSync, spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import { IncomingMessage, request } from 'http';
import { basename, dirname, join, relative } from 'path';
import postcss from 'postcss';

/* eslint-disable no-console */

type Mode = 'development' | 'production';

type Theme = 'b2b' | 'b2c';

interface BundleDelta {
  applicationBytes: number;
  deltaBytes: number;
  deltaPercent?: number;
  webpackBytes: number;
}

interface CliOptions {
  applicationPath: string;
  applicationServerEntry: string;
  build: boolean;
  configurations: MatrixConfiguration[];
  port: number;
  ssr: boolean;
  webpackPath?: string;
  webpackServerEntry?: string;
}

interface FileGroupSummary {
  bytes: number;
  count: number;
}

interface MatrixConfiguration {
  configuration: string;
  mode: Mode;
  theme: Theme;
}

interface OutputSummary {
  css: FileGroupSummary;
  index: ThemeSummary;
  initialAssets: string[];
  initialBytes: FileGroupSummary;
  i18nChunks: Record<string, string[]>;
  js: FileGroupSummary;
  lazyRoutes: Record<string, FileGroupSummary>;
  missingReferences: string[];
  path: string;
}

interface ParityReport {
  application: OutputSummary;
  bundleDeltas: {
    css: BundleDelta;
    initial: BundleDelta;
    js: BundleDelta;
  };
  configuration: string;
  cssSelectorParity: SelectorParitySummary;
  mode: Mode;
  ssr?: SsrParitySummary;
  theme: Theme;
  webpack: OutputSummary;
}

interface SmokeResponse {
  body: string;
  statusCode: number;
}

interface SsrOutputSummary {
  routes: Record<string, number>;
  statusCodes: Record<string, number>;
}

interface SsrParitySummary {
  application: SsrOutputSummary;
  deltaBytes: Record<string, number>;
  webpack: SsrOutputSummary;
}

interface SelectorParitySummary {
  applicationOnlyExamples: string[];
  applicationOnlyRuleBytes: number;
  applicationOnlyRuleExamples: string[];
  applicationOnlyRules: number;
  applicationOnlySelectors: number;
  applicationSelectors: number;
  examples: string[];
  missingInApplication: number;
  webpackSelectors: number;
}

interface CssRuleSummary {
  bytes: number;
  key: string;
  selectorKeys: string[];
}

interface ThemeSummary {
  hasB2BAssets: boolean;
  hasB2BThemeColor: boolean;
  hasB2CAssets: boolean;
  hasB2CThemeColor: boolean;
  path?: string;
}

const DEFAULT_APPLICATION_PATH = join('dist', 'application-spike', 'browser');

const DEFAULT_APPLICATION_SERVER_ENTRY = join('dist', 'application-spike', 'server', 'server.mjs');

const DEFAULT_PORT = 4350;

const I18N_LOCALES = ['de_DE', 'en_US', 'fr_FR'];

const SSR_ROUTES = ['/', '/home', '/account'];

const SELECTOR_PARITY_EXAMPLE_LIMIT = 25;

const WINDOWS_TASK_KILL_COMMAND = 'task' + 'kill';

const MATRIX_CONFIGURATIONS: MatrixConfiguration[] = [
  { configuration: 'b2b,production', mode: 'production', theme: 'b2b' },
  { configuration: 'b2c,production', mode: 'production', theme: 'b2c' },
  { configuration: 'b2b,development', mode: 'development', theme: 'b2b' },
  { configuration: 'b2c,development', mode: 'development', theme: 'b2c' },
];

const LAZY_ROUTE_PATTERNS: Record<string, RegExp> = {
  account: /account-page|account.*module/i,
  basket: /basket-page|basket.*module/i,
  checkout: /checkout-page|checkout.*module/i,
  organizationManagement: /organization-management/i,
  product: /product-page|product.*module/i,
  requisitionManagement: /requisition-management|requisition-detail/i,
  wishlists: /wishlists/i,
};

function normalizeConfigurationArgument(configuration?: string): string | undefined {
  const normalizedConfiguration = configuration?.trim();
  const npmSplitConfiguration = /^([a-z0-9_-]+)\s+(development|production)$/i.exec(normalizedConfiguration || '');

  return npmSplitConfiguration ? `${npmSplitConfiguration[1]},${npmSplitConfiguration[2]}` : normalizedConfiguration;
}

function getNpmConfigFlag(name: string): boolean {
  return /^(true|1)$/i.test(process.env[`npm_config_${name}`] || '');
}

function parseArgs(args: string[]): CliOptions {
  return args.reduce<CliOptions>(
    (options, arg) => {
      if (arg.startsWith('--webpack=')) {
        return { ...options, webpackPath: arg.split('=')[1] };
      }
      if (arg.startsWith('--application=')) {
        return { ...options, applicationPath: arg.split('=')[1] };
      }
      if (arg.startsWith('--webpack-server=')) {
        return { ...options, webpackServerEntry: arg.split('=')[1] };
      }
      if (arg.startsWith('--application-server=')) {
        return { ...options, applicationServerEntry: arg.split('=')[1] };
      }
      if (arg.startsWith('--configuration=')) {
        return { ...options, configurations: getConfigurations(arg.split('=')[1]) };
      }
      if (arg.startsWith('--theme=')) {
        return { ...options, configurations: getConfigurationsByTheme(arg.split('=')[1]) };
      }
      if (arg.startsWith('--port=')) {
        return { ...options, port: Number(arg.split('=')[1]) };
      }
      if (arg === '--build') {
        return { ...options, build: true };
      }
      if (arg === '--ssr') {
        return { ...options, ssr: true };
      }
      return options;
    },
    {
      applicationPath: process.env.npm_config_application || DEFAULT_APPLICATION_PATH,
      applicationServerEntry: process.env.npm_config_application_server || DEFAULT_APPLICATION_SERVER_ENTRY,
      build: getNpmConfigFlag('build'),
      configurations: process.env.npm_config_theme
        ? getConfigurationsByTheme(process.env.npm_config_theme)
        : process.env.npm_config_configuration
          ? getConfigurations(process.env.npm_config_configuration)
          : [MATRIX_CONFIGURATIONS[0]],
      port: process.env.npm_config_port ? Number(process.env.npm_config_port) : DEFAULT_PORT,
      ssr: getNpmConfigFlag('ssr'),
      webpackPath: process.env.npm_config_webpack,
      webpackServerEntry: process.env.npm_config_webpack_server,
    }
  );
}

function getWebpackPath(options: CliOptions, matrixConfiguration: MatrixConfiguration): string {
  if (options.webpackPath) {
    return options.webpackPath;
  }

  const defaultPath = join('dist', 'browser');
  return fs.existsSync(defaultPath) ? defaultPath : join('dist', matrixConfiguration.theme, 'browser');
}

function getWebpackServerEntry(options: CliOptions, matrixConfiguration: MatrixConfiguration): string {
  if (options.webpackServerEntry) {
    return options.webpackServerEntry;
  }

  const defaultEntry = join('dist', 'server', 'main.js');
  return fs.existsSync(defaultEntry) ? defaultEntry : join('dist', matrixConfiguration.theme, 'server', 'main.js');
}

function getConfigurations(value: string): MatrixConfiguration[] {
  if (value === 'all') {
    return MATRIX_CONFIGURATIONS;
  }

  const requestedConfigurations = value
    .split(';')
    .map(configuration => normalizeConfigurationArgument(configuration))
    .filter((configuration): configuration is string => !!configuration);
  const configurations = MATRIX_CONFIGURATIONS.filter(matrixConfiguration =>
    requestedConfigurations.includes(matrixConfiguration.configuration)
  );

  if (configurations.length !== requestedConfigurations.length) {
    throw new Error(`Unknown parity configuration in ${requestedConfigurations.join(', ')}.`);
  }

  return configurations;
}

function getConfigurationsByTheme(value: string): MatrixConfiguration[] {
  if (value !== 'b2b' && value !== 'b2c') {
    throw new Error(`Unknown theme '${value}'.`);
  }

  return MATRIX_CONFIGURATIONS.filter(matrixConfiguration => matrixConfiguration.theme === value);
}

function buildConfiguration(matrixConfiguration: MatrixConfiguration, ssr: boolean) {
  fs.rmSync(join('dist', 'browser'), { force: true, recursive: true });
  fs.rmSync(join('dist', 'server'), { force: true, recursive: true });

  console.log(`application-spike:parity: building webpack ${matrixConfiguration.configuration}`);
  execSync(`npm run ng -- run intershop-pwa:build:${matrixConfiguration.configuration} --progress=false`, {
    stdio: 'inherit',
  });

  if (ssr) {
    console.log(`application-spike:parity: building webpack server ${matrixConfiguration.configuration}`);
    execSync(`npm run ng -- run intershop-pwa:server:${matrixConfiguration.configuration} --progress=false`, {
      stdio: 'inherit',
    });
  }

  console.log(`application-spike:parity: building application ${matrixConfiguration.configuration}`);
  execSync(`npm run build:application-spike -- --configuration=${matrixConfiguration.configuration} --progress=false`, {
    stdio: 'inherit',
  });
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

function findIndex(path: string): string | undefined {
  return ['index.html', 'index.csr.html'].map(indexFile => join(path, indexFile)).find(file => fs.existsSync(file));
}

function getInitialAssets(path: string, index: string): string[] {
  const scriptAssets = [...index.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map(match => match[1]);
  const styleAssets = [...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/g)].map(match => match[1]);

  return [...new Set([...scriptAssets, ...styleAssets])].map(asset => join(path, asset.replace(/^\//, '')));
}

function getThemeSummary(index: string, indexPath?: string): ThemeSummary {
  return {
    hasB2BAssets: index.includes('assets/themes/b2b'),
    hasB2BThemeColor: index.includes('#006b99'),
    hasB2CAssets: index.includes('assets/themes/b2c'),
    hasB2CThemeColor: index.includes('#006f6f'),
    path: indexPath,
  };
}

function summarizeFiles(files: string[]): FileGroupSummary {
  return {
    bytes: files.reduce((sum, file) => sum + fs.statSync(file).size, 0),
    count: files.length,
  };
}

function summarizeLazyRoutes(files: string[]): Record<string, FileGroupSummary> {
  return Object.fromEntries(
    Object.entries(LAZY_ROUTE_PATTERNS).map(([route, pattern]) => [
      route,
      summarizeFiles(files.filter(file => pattern.test(basename(file)))),
    ])
  );
}

function summarizeI18nChunks(files: string[]): Record<string, string[]> {
  return Object.fromEntries(
    I18N_LOCALES.map(locale => [
      locale,
      files
        .filter(file => new RegExp(locale.replace('_', '[_-]'), 'i').test(basename(file)))
        .map(file => basename(file))
        .sort(),
    ])
  );
}

function getReferencedFiles(path: string, index: string, jsFiles: string[]): string[] {
  const indexAssets = getInitialAssets(path, index);
  const dynamicImports = jsFiles.flatMap(file => {
    const content = fs.readFileSync(file, { encoding: 'utf-8' });
    return [...content.matchAll(/import\("\.\/([^"]+\.(?:js|css))"\)/g)].map(match => join(dirname(file), match[1]));
  });

  return [...new Set([...indexAssets, ...dynamicImports])];
}

function summarizeOutput(path: string): OutputSummary {
  const files = collectFiles(path);
  const indexPath = findIndex(path);
  const index = indexPath ? fs.readFileSync(indexPath, { encoding: 'utf-8' }) : '';
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));
  const initialAssets = getInitialAssets(path, index);
  const referencedFiles = getReferencedFiles(path, index, jsFiles);

  return {
    css: summarizeFiles(cssFiles),
    index: getThemeSummary(index, indexPath),
    initialAssets: initialAssets.map(file => relative(path, file).replace(/\\/g, '/')),
    initialBytes: summarizeFiles(initialAssets.filter(file => fs.existsSync(file))),
    i18nChunks: summarizeI18nChunks(jsFiles),
    js: summarizeFiles(jsFiles),
    lazyRoutes: summarizeLazyRoutes(jsFiles),
    missingReferences: referencedFiles
      .filter(file => !fs.existsSync(file))
      .map(file => relative(path, file).replace(/\\/g, '/'))
      .sort(),
    path,
  };
}

function splitSelectorList(selector: string): string[] {
  const selectors: string[] = [];
  let currentSelector = '';
  let bracketDepth = 0;
  let parenthesisDepth = 0;
  let quote: '"' | "'" | undefined;

  for (let index = 0; index < selector.length; index++) {
    const character = selector[index];
    const previousCharacter = selector[index - 1];

    if (quote) {
      currentSelector += character;
      if (character === quote && previousCharacter !== '\\') {
        quote = undefined;
      }
      continue;
    }

    switch (character) {
      case '"':
      case "'":
        quote = character;
        currentSelector += character;
        break;
      case '[':
        bracketDepth++;
        currentSelector += character;
        break;
      case ']':
        bracketDepth--;
        currentSelector += character;
        break;
      case '(':
        parenthesisDepth++;
        currentSelector += character;
        break;
      case ')':
        parenthesisDepth--;
        currentSelector += character;
        break;
      case ',':
        if (bracketDepth === 0 && parenthesisDepth === 0) {
          selectors.push(currentSelector);
          currentSelector = '';
        } else {
          currentSelector += character;
        }
        break;
      default:
        currentSelector += character;
    }
  }

  selectors.push(currentSelector);
  return selectors;
}

function normalizeCssText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*([>+~(),:])\s*/g, '$1')
    .trim();
}

function getRuleAtRuleContext(rule: postcss.Rule): string {
  const atRules: string[] = [];
  let parent: postcss.Node | undefined = rule.parent;

  while (parent) {
    // cspell:disable-next-line
    if (parent.type === 'atrule') {
      const atRule = parent as postcss.AtRule;
      atRules.push(`@${atRule.name} ${normalizeCssText(atRule.params)}`);
    }
    parent = parent.parent;
  }

  return atRules.reverse().join('|');
}

function getCssSelectorKey(rule: postcss.Rule, selector: string): string {
  const atRuleContext = getRuleAtRuleContext(rule);
  const normalizedSelector = normalizeCssText(selector);
  return atRuleContext ? `${atRuleContext}|${normalizedSelector}` : normalizedSelector;
}

function collectCssSelectors(path: string): Set<string> {
  const cssFiles = collectFiles(path).filter(file => file.endsWith('.css'));
  const selectors = new Set<string>();

  cssFiles.forEach(file => {
    const root = postcss.parse(fs.readFileSync(file, { encoding: 'utf-8' }), { from: file });
    root.walkRules(rule => {
      splitSelectorList(rule.selector)
        .map(selector => selector.trim())
        .filter(Boolean)
        .forEach(selector => selectors.add(getCssSelectorKey(rule, selector)));
    });
  });

  return selectors;
}

function collectCssRuleSummaries(path: string): CssRuleSummary[] {
  return collectFiles(path)
    .filter(file => file.endsWith('.css'))
    .flatMap(file => {
      const root = postcss.parse(fs.readFileSync(file, { encoding: 'utf-8' }), { from: file });
      const rules: CssRuleSummary[] = [];

      root.walkRules(rule => {
        const selectorKeys = splitSelectorList(rule.selector)
          .map(selector => selector.trim())
          .filter(Boolean)
          .map(selector => getCssSelectorKey(rule, selector));

        rules.push({
          bytes: rule.toString().length,
          key: getCssSelectorKey(rule, rule.selector),
          selectorKeys,
        });
      });

      return rules;
    });
}

function summarizeCssSelectorParity(webpackPath: string, applicationPath: string): SelectorParitySummary {
  const webpackSelectors = collectCssSelectors(webpackPath);
  const applicationSelectors = collectCssSelectors(applicationPath);
  const missingSelectors = [...webpackSelectors].filter(selector => !applicationSelectors.has(selector)).sort();
  const applicationOnlySelectors = [...applicationSelectors].filter(selector => !webpackSelectors.has(selector)).sort();
  const applicationOnlyRules = collectCssRuleSummaries(applicationPath)
    .filter(rule => rule.selectorKeys.length && rule.selectorKeys.every(selector => !webpackSelectors.has(selector)))
    .sort((left, right) => right.bytes - left.bytes);

  return {
    applicationOnlyExamples: applicationOnlySelectors.slice(0, SELECTOR_PARITY_EXAMPLE_LIMIT),
    applicationOnlyRuleBytes: applicationOnlyRules.reduce((sum, rule) => sum + rule.bytes, 0),
    applicationOnlyRuleExamples: applicationOnlyRules
      .slice(0, SELECTOR_PARITY_EXAMPLE_LIMIT)
      .map(rule => `${rule.bytes} B ${rule.key}`),
    applicationOnlyRules: applicationOnlyRules.length,
    applicationOnlySelectors: applicationOnlySelectors.length,
    applicationSelectors: applicationSelectors.size,
    examples: missingSelectors.slice(0, SELECTOR_PARITY_EXAMPLE_LIMIT),
    missingInApplication: missingSelectors.length,
    webpackSelectors: webpackSelectors.size,
  };
}

function assertCssSelectorParity(summary: SelectorParitySummary) {
  if (summary.missingInApplication === 0) {
    return;
  }

  throw new Error(
    [
      `Application builder CSS is missing ${summary.missingInApplication} webpack selector(s).`,
      ...summary.examples.map(selector => `  - ${selector}`),
    ].join('\n')
  );
}

function assertTheme(summary: OutputSummary, theme: Theme, label: string) {
  const hasExpectedTheme = theme === 'b2b' ? summary.index.hasB2BAssets : summary.index.hasB2CAssets;
  const hasExpectedThemeColor = theme === 'b2b' ? summary.index.hasB2BThemeColor : summary.index.hasB2CThemeColor;

  if (!hasExpectedTheme) {
    throw new Error(`${label} output does not contain expected ${theme} assets in ${summary.index.path || 'index'}.`);
  }
  if (!hasExpectedThemeColor) {
    throw new Error(`${label} output does not contain expected ${theme} theme color.`);
  }
}

function toBundleDelta(applicationBytes: number, webpackBytes: number): BundleDelta {
  const deltaBytes = applicationBytes - webpackBytes;
  return {
    applicationBytes,
    deltaBytes,
    deltaPercent: webpackBytes ? Number(((deltaBytes / webpackBytes) * 100).toFixed(2)) : undefined,
    webpackBytes,
  };
}

function getResponseBody(response: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    response.on('data', chunk => chunks.push(Buffer.from(chunk)));
    response.on('error', reject);
    response.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

function requestPath(port: number, path: string): Promise<SmokeResponse> {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: 'localhost', method: 'GET', path, port, timeout: 60000 }, response => {
      getResponseBody(response)
        .then(body => resolve({ body, statusCode: response.statusCode || 0 }))
        .catch(reject);
    });

    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error(`Request timed out for ${path}.`)));
    req.end();
  });
}

function startServer(entry: string, browserFolder: string, port: number): ChildProcess {
  if (!fs.existsSync(entry)) {
    throw new Error(`Missing SSR server entry ${entry}.`);
  }

  return spawn(process.execPath, [entry], {
    detached: true,
    env: {
      ...process.env,
      BROWSER_FOLDER: browserFolder,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
}

function stopServer(server: ChildProcess) {
  if (!server.pid) {
    return;
  }

  if (process.platform === 'win32') {
    try {
      execSync(`${WINDOWS_TASK_KILL_COMMAND} /pid ${server.pid} /T /F`, { stdio: 'ignore' });
    } catch {
      server.kill();
    }
  } else {
    process.kill(-server.pid, 'SIGTERM');
  }
}

async function waitForServer(port: number) {
  const timeoutAt = Date.now() + 60000;
  let lastError: unknown;

  while (Date.now() < timeoutAt) {
    try {
      const response = await requestPath(port, '/');
      if (response.statusCode === 200) {
        return;
      }
      lastError = new Error(`Server returned ${response.statusCode} for readiness check.`);
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw lastError instanceof Error ? lastError : new Error('SSR server did not become ready.');
}

async function summarizeSsr(entry: string, browserFolder: string, port: number): Promise<SsrOutputSummary> {
  const server = startServer(entry, browserFolder, port);
  const routes: Record<string, number> = {};
  const statusCodes: Record<string, number> = {};

  try {
    await waitForServer(port);
    for (const route of SSR_ROUTES) {
      const response = await requestPath(port, route);
      routes[route] = response.body.length;
      statusCodes[route] = response.statusCode;
    }
    return { routes, statusCodes };
  } finally {
    stopServer(server);
  }
}

async function summarizeSsrParity(
  options: CliOptions,
  webpackPath: string,
  webpackServerEntry: string,
  offset: number
): Promise<SsrParitySummary> {
  const webpack = await summarizeSsr(webpackServerEntry, webpackPath, options.port + offset);
  const application = await summarizeSsr(
    options.applicationServerEntry,
    options.applicationPath,
    options.port + offset + 1
  );

  return {
    application,
    deltaBytes: Object.fromEntries(
      SSR_ROUTES.map(route => [route, (application.routes[route] || 0) - (webpack.routes[route] || 0)])
    ),
    webpack,
  };
}

async function createReport(matrixConfiguration: MatrixConfiguration, options: CliOptions, index: number) {
  if (options.build) {
    buildConfiguration(matrixConfiguration, options.ssr);
  }

  const webpackPath = getWebpackPath(options, matrixConfiguration);
  const webpackServerEntry = getWebpackServerEntry(options, matrixConfiguration);
  const webpack = summarizeOutput(webpackPath);
  const application = summarizeOutput(options.applicationPath);
  const cssSelectorParity = summarizeCssSelectorParity(webpackPath, options.applicationPath);

  assertTheme(webpack, matrixConfiguration.theme, 'Webpack');
  assertTheme(application, matrixConfiguration.theme, 'Application builder spike');
  assertCssSelectorParity(cssSelectorParity);

  const report: ParityReport = {
    application,
    bundleDeltas: {
      css: toBundleDelta(application.css.bytes, webpack.css.bytes),
      initial: toBundleDelta(application.initialBytes.bytes, webpack.initialBytes.bytes),
      js: toBundleDelta(application.js.bytes, webpack.js.bytes),
    },
    configuration: matrixConfiguration.configuration,
    cssSelectorParity,
    mode: matrixConfiguration.mode,
    theme: matrixConfiguration.theme,
    webpack,
  };

  if (options.ssr) {
    report.ssr = await summarizeSsrParity(options, webpackPath, webpackServerEntry, index * 2);
  }

  return report;
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  const reports: ParityReport[] = [];

  for (const [index, matrixConfiguration] of options.configurations.entries()) {
    reports.push(await createReport(matrixConfiguration, options, index));
  }

  console.log(JSON.stringify({ reports }, undefined, 2));
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
