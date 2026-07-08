const fs = require('fs');
const path = require('path');
const { sync: spawnSync } = require('cross-spawn');

const angularJson = JSON.parse(fs.readFileSync('./angular.json', { encoding: 'utf-8' }));
const defaultProject = Object.keys(angularJson.projects).find(project => angularJson.projects[project].root === '');

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function stripTrailingSeparator(filePath) {
  return filePath.replace(/[\\/]$/, '');
}

function getDefaultOutputBasePath() {
  const outputPath = angularJson.projects[defaultProject].architect.build.options.outputPath;
  return path.dirname(outputPath);
}

function getOutputBasePath(outputPath) {
  if (!outputPath) {
    return getDefaultOutputBasePath();
  }

  const normalizedOutputPath = stripTrailingSeparator(normalizePath(outputPath));
  if (normalizedOutputPath.endsWith('/browser') || normalizedOutputPath.endsWith('/server')) {
    return path.dirname(normalizedOutputPath);
  }

  return normalizedOutputPath;
}

function splitBuildArgs(args) {
  const remainingArgs = [];
  let outputPath;
  let purgeCss = /^(true|1|on|yes)$/i.test(process.env.npm_config_purge_css || '');

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    if (arg === '--output-path') {
      outputPath = args[index + 1];
      index++;
    } else if (arg.startsWith('--output-path=')) {
      outputPath = arg.split('=')[1];
    } else if (arg === '--purge-css') {
      purgeCss = true;
    } else {
      remainingArgs.push(arg);
    }
  }

  return {
    outputBasePath: getOutputBasePath(outputPath),
    purgeCss,
    remainingArgs,
  };
}

function writeServerCompatibilityEntrypoint(outputBasePath) {
  const serverOutputPath = path.join(outputBasePath, 'server');
  const serverEntry = path.join(serverOutputPath, 'server.mjs');
  const compatibilityEntry = path.join(serverOutputPath, 'main.js');

  if (fs.existsSync(serverEntry)) {
    fs.writeFileSync(compatibilityEntry, "import('./server.mjs');\n");
  }
}

function getConfigurationArgs() {
  const configuration = process.env.npm_config_configuration;

  if (configuration === 'true') {
    console.error('it seems you missed the equal sign in "--configuration=<config>"');
    process.exit(1);
  }

  return configuration
    ? [`--configuration=${configuration.replace(/^([a-z0-9_-]+)\s+(development|production)$/i, '$1,$2')}`]
    : [];
}

const processArgs = process.argv.slice(2);
const client = processArgs.includes('client') || !processArgs.includes('server');
const server = processArgs.includes('server') || !processArgs.includes('client');
const buildArgs = processArgs.filter(arg => arg !== 'client' && arg !== 'server');
const { outputBasePath, purgeCss, remainingArgs } = splitBuildArgs(buildArgs);

if (!client && !server) {
  process.exit(0);
}

if (processArgs.includes('client') || processArgs.includes('server')) {
  console.warn('Application builder creates browser and server bundles in a single build.');
}

const result = spawnSync(
  'ts-node',
  [
    '--project',
    'tsconfig.scripts.json',
    'scripts/build/application-builder.ts',
    ...getConfigurationArgs(),
    ...remainingArgs,
  ],
  {
    env: {
      ...process.env,
      APPLICATION_BUILDER_OUTPUT_BASE_PATH: outputBasePath,
      ...(purgeCss ? { APPLICATION_BUILDER_PURGE_CSS: 'true' } : {}),
      APPLICATION_BUILDER_RUNNER_LABEL: 'build',
      APPLICATION_BUILDER_VERSION_LABEL: 'application-builder',
    },
    stdio: 'inherit',
  }
);

if (result.status !== 0) {
  process.exit(result.status);
}

writeServerCompatibilityEntrypoint(outputBasePath);
