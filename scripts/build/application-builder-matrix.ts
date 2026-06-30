import { execSync, spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import { IncomingMessage, request } from 'http';
import { join } from 'path';

/* eslint-disable no-console */

interface CliOptions {
  configurations: MatrixConfiguration[];
  port: number;
  skipBuild: boolean;
}

interface MatrixConfiguration {
  configuration: string;
  mode: 'development' | 'production';
  theme: 'b2b' | 'b2c';
}

interface SmokeResponse {
  body: string;
  cacheControl?: string;
  contentType?: string;
  statusCode: number;
}

interface MatrixResult {
  assets: string[];
  configuration: string;
  mode: string;
  port: number;
  routes: Record<string, number>;
  theme: string;
}

interface ReplacementReport {
  purgeCss?: {
    bytesAfter: number;
    bytesBefore: number;
    enabled: boolean;
    files: number;
    mode: 'disabled' | 'safe' | 'strict';
  };
}

const BROWSER_OUTPUT_PATH = join(process.cwd(), 'dist', 'application-builder', 'browser');

const SERVER_ENTRY = join(process.cwd(), 'dist', 'application-builder', 'server', 'server.mjs');

const DEFAULT_PORT = 4310;

const SMOKE_ROUTES = ['/', '/home', '/account'];

const WINDOWS_TASK_KILL_COMMAND = 'task' + 'kill';

const MATRIX_CONFIGURATIONS: MatrixConfiguration[] = [
  { configuration: 'b2b,production', mode: 'production', theme: 'b2b' },
  { configuration: 'b2c,production', mode: 'production', theme: 'b2c' },
  { configuration: 'b2b,development', mode: 'development', theme: 'b2b' },
  { configuration: 'b2c,development', mode: 'development', theme: 'b2c' },
];

function normalizeConfigurationArgument(configuration?: string): string | undefined {
  const normalizedConfiguration = configuration?.trim();
  const npmSplitConfiguration = /^([a-z0-9_-]+)\s+(development|production)$/i.exec(normalizedConfiguration || '');

  return npmSplitConfiguration ? `${npmSplitConfiguration[1]},${npmSplitConfiguration[2]}` : normalizedConfiguration;
}

function getNpmConfigFlag(name: string): boolean {
  return /^(true|1)$/i.test(process.env[`npm_config_${name}`] || '');
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
    throw new Error(`Unknown matrix configuration in ${requestedConfigurations.join(', ')}.`);
  }

  return configurations;
}

function parseArgs(args: string[]): CliOptions {
  return args.reduce<CliOptions>(
    (options, arg) => {
      if (arg.startsWith('--configuration=')) {
        return { ...options, configurations: getConfigurations(arg.split('=')[1]) };
      }
      if (arg.startsWith('--port=')) {
        return { ...options, port: Number(arg.split('=')[1]) };
      }
      if (arg === '--skip-build') {
        return { ...options, skipBuild: true };
      }
      return options;
    },
    {
      configurations: process.env.npm_config_configuration
        ? getConfigurations(process.env.npm_config_configuration)
        : MATRIX_CONFIGURATIONS,
      port: process.env.npm_config_port ? Number(process.env.npm_config_port) : DEFAULT_PORT,
      skipBuild: getNpmConfigFlag('skip_build'),
    }
  );
}

function buildConfiguration(configuration: string) {
  console.log(`application-builder:matrix: building ${configuration}`);
  execSync(`npm run build:application-builder -- --configuration=${configuration} --progress=false`, {
    stdio: 'inherit',
  });
}

function readIndex(): string {
  const indexPath = join(BROWSER_OUTPUT_PATH, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing application spike index at ${indexPath}.`);
  }
  return fs.readFileSync(indexPath, { encoding: 'utf-8' });
}

function assertTheme(index: string, theme: 'b2b' | 'b2c') {
  const otherTheme = theme === 'b2b' ? 'b2c' : 'b2b';
  const themeColor = theme === 'b2b' ? '#006b99' : '#006f6f';

  if (!index.includes(`assets/themes/${theme}`)) {
    throw new Error(`index.html does not contain assets for ${theme}.`);
  }
  if (index.includes(`assets/themes/${otherTheme}`)) {
    throw new Error(`index.html also contains assets for ${otherTheme}.`);
  }
  if (!index.includes(themeColor)) {
    throw new Error(`index.html does not contain theme color ${themeColor} for ${theme}.`);
  }
}

function normalizeAssetPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

function getInitialAssets(index: string): string[] {
  const scriptAssets = [...index.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map(match => match[1]);
  const styleAssets = [...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/g)].map(match => match[1]);
  const assets = [...scriptAssets, ...styleAssets].map(normalizeAssetPath);

  if (!assets.length) {
    throw new Error('index.html does not reference any initial JS/CSS assets.');
  }

  return assets;
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

function assertProductionTestingIdsRemoved(mode: 'development' | 'production') {
  if (mode !== 'production' || process.env.TESTING) {
    return;
  }

  const filesWithTestingIds = collectFiles(BROWSER_OUTPUT_PATH).filter(file => {
    if (!/\.(html|js)$/.test(file)) {
      return false;
    }
    return fs.readFileSync(file, { encoding: 'utf-8' }).includes('data-testing-');
  });

  if (filesWithTestingIds.length) {
    throw new Error(`Production output still contains data-testing attributes in ${filesWithTestingIds.join(', ')}.`);
  }
}

function readReplacementReport(): ReplacementReport {
  const reportPath = join('dist', 'application-builder', 'theme-replacements-report.json');
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Missing application spike replacement report at ${reportPath}.`);
  }

  return JSON.parse(fs.readFileSync(reportPath, { encoding: 'utf-8' })) as ReplacementReport;
}

function assertPurgeCssReport(mode: 'development' | 'production') {
  const purgeCss = readReplacementReport().purgeCss;
  const purgeCssDisabled = /^(off|0|false|no)$/i.test(process.env.APPLICATION_BUILDER_PURGE_CSS || '');
  if (!purgeCss) {
    throw new Error('Application spike replacement report does not contain purgeCss diagnostics.');
  }

  if (mode === 'development' && purgeCss.enabled) {
    throw new Error('PurgeCSS should be disabled for development output.');
  }
  if (mode === 'production' && !purgeCssDisabled && (!purgeCss.enabled || purgeCss.files === 0)) {
    throw new Error('PurgeCSS should process production CSS output.');
  }
  if (mode === 'production' && !purgeCssDisabled && purgeCss.mode !== 'safe' && purgeCss.mode !== 'strict') {
    throw new Error(`PurgeCSS should report safe or strict mode for production output, got ${purgeCss.mode}.`);
  }
  if (mode === 'production' && purgeCss.bytesAfter > purgeCss.bytesBefore) {
    throw new Error('PurgeCSS output is larger than the original production CSS output.');
  }
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
        .then(body =>
          resolve({
            body,
            cacheControl: response.headers['cache-control']?.toString(),
            contentType: response.headers['content-type']?.toString(),
            statusCode: response.statusCode || 0,
          })
        )
        .catch(reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`Request timed out for ${path}.`));
    });
    req.end();
  });
}

function startServer(port: number): ChildProcess {
  if (!fs.existsSync(SERVER_ENTRY)) {
    throw new Error(`Missing application spike server at ${SERVER_ENTRY}.`);
  }

  console.log(`application-builder:matrix: starting server on port ${port}`);
  return spawn(process.execPath, [SERVER_ENTRY], {
    detached: true,
    env: {
      ...process.env,
      BROWSER_FOLDER: BROWSER_OUTPUT_PATH,
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

function wireServerOutput(server: ChildProcess) {
  server.stdout?.on('data', chunk => console.log(chunk.toString().trimEnd()));
  server.stderr?.on('data', chunk => console.error(chunk.toString().trimEnd()));
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

  throw lastError instanceof Error ? lastError : new Error('Application spike server did not become ready.');
}

async function assertRoutes(port: number): Promise<Record<string, number>> {
  const routeResults: Record<string, number> = {};

  for (const route of SMOKE_ROUTES) {
    const response = await requestPath(port, route);
    routeResults[route] = response.statusCode;
    if (response.statusCode !== 200) {
      throw new Error(`${route} returned ${response.statusCode}.`);
    }
  }

  return routeResults;
}

function assertAssetCache(asset: string, mode: 'development' | 'production', response: SmokeResponse) {
  if (response.statusCode !== 200) {
    throw new Error(`${asset} returned ${response.statusCode}.`);
  }

  if (mode === 'development' && response.cacheControl !== 'no-store') {
    throw new Error(`${asset} should use Cache-Control: no-store in development, got ${response.cacheControl}.`);
  }

  if (mode === 'production' && !response.cacheControl?.startsWith('public, max-age=')) {
    throw new Error(`${asset} should keep production public max-age caching, got ${response.cacheControl}.`);
  }
}

async function assertAssets(port: number, mode: 'development' | 'production', assets: string[]) {
  for (const asset of assets) {
    const response = await requestPath(port, asset);
    assertAssetCache(asset, mode, response);
  }
}

async function smokeConfiguration(matrixConfiguration: MatrixConfiguration, port: number): Promise<MatrixResult> {
  const index = readIndex();
  assertTheme(index, matrixConfiguration.theme);
  assertProductionTestingIdsRemoved(matrixConfiguration.mode);
  assertPurgeCssReport(matrixConfiguration.mode);
  const assets = getInitialAssets(index);
  const server = startServer(port);
  wireServerOutput(server);

  try {
    await waitForServer(port);
    const routes = await assertRoutes(port);
    await assertAssets(port, matrixConfiguration.mode, assets);
    return {
      assets,
      configuration: matrixConfiguration.configuration,
      mode: matrixConfiguration.mode,
      port,
      routes,
      theme: matrixConfiguration.theme,
    };
  } finally {
    stopServer(server);
  }
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  const results: MatrixResult[] = [];

  for (const matrixConfiguration of options.configurations) {
    const port = options.port + results.length;
    if (!options.skipBuild) {
      buildConfiguration(matrixConfiguration.configuration);
    }
    results.push(await smokeConfiguration(matrixConfiguration, port));
    console.log(`application-builder:matrix: ${matrixConfiguration.configuration} passed`);
  }

  console.log(JSON.stringify({ results }, undefined, 2));
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
