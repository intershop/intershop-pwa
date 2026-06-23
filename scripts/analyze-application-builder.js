const fs = require('fs');
const http = require('http');
const path = require('path');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8888;

function parseArgs(args) {
  return args.reduce(
    (options, arg) => {
      if (arg === '--no-open') {
        return { ...options, open: false };
      }
      if (arg === '--open') {
        return { ...options, open: true };
      }
      if (arg.startsWith('--bundle-dir=')) {
        return { ...options, bundleDir: arg.split('=')[1] };
      }
      if (arg.startsWith('--default-sizes=')) {
        return { ...options, defaultSizes: arg.split('=')[1] };
      }
      if (arg.startsWith('--host=')) {
        return { ...options, host: arg.split('=')[1] };
      }
      if (arg.startsWith('--mode=')) {
        return { ...options, mode: arg.split('=')[1] };
      }
      if (arg.startsWith('--port=')) {
        return { ...options, port: Number(arg.split('=')[1]) };
      }
      if (arg.startsWith('--report=')) {
        return { ...options, report: arg.split('=')[1] };
      }
      if (arg.startsWith('--title=')) {
        return { ...options, title: arg.split('=')[1] };
      }
      if (!arg.startsWith('--')) {
        return { ...options, statsPath: arg };
      }
      return options;
    },
    {
      defaultSizes: 'parsed',
      host: process.env.HOST || DEFAULT_HOST,
      mode: 'server',
      open: true,
      port: process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT,
      report: undefined,
      statsPath: path.join('dist', 'stats.json'),
      title: 'Application Builder Bundle Analyzer',
    }
  );
}

function assertStatsFile(statsPath) {
  if (!fs.existsSync(statsPath)) {
    console.error(`Missing application builder stats file: ${statsPath}`);
    console.error('Run `npm run build -- --stats-json` first.');
    process.exit(1);
  }
}

function readMetafile(statsPath) {
  assertStatsFile(statsPath);
  return JSON.parse(fs.readFileSync(statsPath, { encoding: 'utf-8' }));
}

function findBundleDir(statsPath, configuredBundleDir) {
  if (configuredBundleDir) {
    return configuredBundleDir;
  }

  const statsDir = path.dirname(path.resolve(statsPath));
  const candidates = [
    path.join(statsDir, 'browser'),
    statsDir,
    path.join(process.cwd(), 'dist', 'browser'),
    path.join(process.cwd(), 'dist', 'application-spike', 'browser'),
  ];
  const bundleDir = candidates.find(candidate => fs.existsSync(candidate));
  if (!bundleDir) {
    throw new Error(`Could not resolve bundle directory for ${statsPath}.`);
  }
  return bundleDir;
}

function readInitialAssets(bundleDir) {
  const indexPath = path.join(bundleDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return new Set();
  }

  const index = fs.readFileSync(indexPath, { encoding: 'utf-8' });
  return new Set(
    [
      ...[...index.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map(match => match[1]),
      ...[...index.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/g)].map(match => match[1]),
    ].flatMap(asset => [asset.replace(/^\//, ''), path.basename(asset)])
  );
}

function createPseudoSource(length, seedText) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  let seed = 0;
  let source = '';

  for (let index = 0; index < seedText.length; index++) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  while (source.length < length) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    source += chars[(seed >>> 16) % chars.length];
  }

  return source.slice(0, length);
}

function createParsedSourceReader(bundlePath) {
  const bundleSource = fs.readFileSync(bundlePath, { encoding: 'utf-8' });
  let offset = 0;

  return (length, seedText) => {
    if (!length) {
      return undefined;
    }

    const parsedSource = bundleSource.slice(offset, offset + length);
    offset += length;

    if (parsedSource.length >= length) {
      return parsedSource;
    }

    return parsedSource + createPseudoSource(length - parsedSource.length, seedText);
  };
}

function toSafeAssetName(name, extension) {
  return `${name.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '')}${extension}`;
}

function toChunkName(outputName, output) {
  if (/^main-[A-Z0-9]+\.js$/i.test(outputName)) {
    return 'main';
  }
  if (/^polyfills-[A-Z0-9]+\.js$/i.test(outputName)) {
    return 'polyfills';
  }
  if (/^styles-[A-Z0-9]+\.css$/i.test(outputName)) {
    return 'styles';
  }
  if (output.entryPoint) {
    return path.basename(output.entryPoint).replace(/\.[cm]?[jt]s$/, '');
  }
  if (outputName.startsWith('chunk-')) {
    const largestInput = Object.keys(output.inputs || {}).sort(
      (left, right) => (output.inputs[right].bytesInOutput || 0) - (output.inputs[left].bytesInOutput || 0)
    )[0];
    if (largestInput) {
      return path.basename(largestInput).replace(/\.[cm]?[jt]s$/, '');
    }
  }
  return outputName.replace(/\.[a-f0-9]{8,}(?=\.)/i, '').replace(/\.[^.]+$/, '');
}

function toAnalyzerAssetName(outputName, chunkName, usedNames) {
  const extension = path.extname(outputName);
  const keepOutputName =
    /^main-[A-Z0-9]+\.js$/i.test(outputName) ||
    /^polyfills-[A-Z0-9]+\.js$/i.test(outputName) ||
    /^styles-[A-Z0-9]+\.css$/i.test(outputName);
  const baseName = keepOutputName
    ? outputName
    : toSafeAssetName(chunkName || path.basename(outputName, extension), extension);
  let assetName = baseName;
  let counter = 2;

  while (usedNames.has(assetName)) {
    assetName = baseName.replace(new RegExp(`${extension.replace('.', '\\.')}$`), `-${counter}${extension}`);
    counter++;
  }

  usedNames.add(assetName);
  return assetName;
}

function prepareAnalyzerBundleDir(statsPath) {
  const directory = path.join(path.dirname(path.resolve(statsPath)), 'application-builder-analyzer-bundles');
  fs.rmSync(directory, { force: true, recursive: true });
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

function toWebpackStats(metafile, bundleDir, analyzerBundleDir) {
  const initialAssets = readInitialAssets(bundleDir);
  const assets = [];
  const chunks = [];
  const entrypointAssets = [];
  const modules = [];
  const usedAssetNames = new Set();
  let chunkId = 0;

  Object.entries(metafile.outputs || {}).forEach(([outputName, output]) => {
    const bundlePath = path.join(bundleDir, outputName);
    if (outputName.endsWith('.map') || !fs.existsSync(bundlePath)) {
      return;
    }

    const id = chunkId++;
    const chunkName = toChunkName(outputName, output);
    const assetName = toAnalyzerAssetName(outputName, chunkName, usedAssetNames);
    fs.copyFileSync(bundlePath, path.join(analyzerBundleDir, assetName));
    const readParsedSource = createParsedSourceReader(bundlePath);
    const chunkModules = Object.entries(output.inputs || {}).map(([inputName, input]) => {
      const size = input.bytesInOutput || 0;
      const module = {
        chunks: [id],
        id: modules.length,
        identifier: `${outputName}!${inputName}`,
        name: inputName,
        size,
      };
      const parsedSrc = readParsedSource(size, `${outputName}!${inputName}`);
      if (parsedSrc) {
        module.parsedSrc = parsedSrc;
      }
      modules.push(module);
      return module;
    });
    const size = fs.statSync(bundlePath).size;
    const initial = initialAssets.has(outputName) || initialAssets.has(path.basename(outputName));
    if (initial) {
      entrypointAssets.push(assetName);
    }

    assets.push({
      chunks: [id],
      emitted: true,
      info: {
        javascriptModule: /\.m?js$/.test(assetName),
      },
      name: assetName,
      size,
    });
    chunks.push({
      entry: !!output.entryPoint,
      files: [assetName],
      id,
      initial,
      modules: chunkModules,
      names: [chunkName],
      size,
    });
  });

  return {
    assets,
    chunks,
    entrypoints: entrypointAssets.length
      ? {
          main: {
            assets: entrypointAssets.map(name => ({ name })),
            name: 'main',
          },
        }
      : {},
    errors: [],
    hash: 'application-builder',
    modules,
    version: 'application-builder',
    warnings: [],
  };
}

function writeWebpackStats(options, stats) {
  const statsDir = path.dirname(path.resolve(options.statsPath));
  const outputPath = path.join(statsDir, 'application-builder-webpack-stats.json');
  fs.writeFileSync(outputPath, JSON.stringify(stats, undefined, 2));
  return outputPath;
}

function getReportPath(options) {
  if (options.report) {
    return path.resolve(options.report);
  }
  return path.resolve(options.mode === 'json' ? 'report.json' : path.join('dist', 'application-builder-analyzer.html'));
}

function getEntrypoints(stats) {
  return Object.values(stats.entrypoints || {}).map(entrypoint => entrypoint.name);
}

function getChartData(stats, bundleDir, logger) {
  const analyzer = require('webpack-bundle-analyzer/lib/analyzer');
  const chartData = analyzer.getViewerData(stats, bundleDir, {
    compressionAlgorithm: 'gzip',
    excludeAssets: null,
    logger,
  });

  if (!Array.isArray(chartData)) {
    throw new Error('Could not create webpack-bundle-analyzer chart data.');
  }

  return chartData;
}

function readPatchedViewer() {
  const viewerPath = require.resolve('webpack-bundle-analyzer/public/viewer.js');
  const viewer = fs.readFileSync(viewerPath, { encoding: 'utf-8' });
  const patchedViewer = viewer.replace(
    /(handleSelectedChunksChange=\w+=>\{)(\w+)\.setSelectedSize\((\w+)\)\}/,
    '$1$2.setSelectedChunks($3)}'
  );

  if (patchedViewer === viewer) {
    console.warn(
      'Could not patch webpack-bundle-analyzer chunk selection handler; size switching may fall back to Stat.'
    );
  }

  return patchedViewer;
}

function renderPatchedViewer({ chartData, compressionAlgorithm = 'gzip', defaultSizes, entrypoints, mode, title }) {
  const { renderViewer } = require('webpack-bundle-analyzer/lib/template');
  const html = renderViewer({
    chartData,
    compressionAlgorithm,
    defaultSizes,
    enableWebSocket: false,
    entrypoints,
    mode: 'server',
    title,
  });

  if (mode !== 'static') {
    return html;
  }

  return html.replace(
    '<script src="viewer.js"></script>',
    '<!-- viewer.js -->\n<script>' + readPatchedViewer() + '</script>'
  );
}

function openReport(target, logger) {
  const { open } = require('webpack-bundle-analyzer/lib/utils');
  open(target, logger);
}

function writeStaticReport(options, chartData, entrypoints, logger) {
  const reportPath = getReportPath(options);
  const reportHtml = renderPatchedViewer({
    chartData,
    defaultSizes: options.defaultSizes,
    entrypoints,
    mode: 'static',
    title: options.title,
  });

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportHtml);
  logger.info('Webpack Bundle Analyzer saved report to ' + reportPath);

  if (options.open) {
    openReport('file://' + reportPath, logger);
  }
}

function writeJsonReport(options, chartData, logger) {
  const reportPath = getReportPath(options);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(chartData));
  logger.info('Webpack Bundle Analyzer saved JSON report to ' + reportPath);
}

function startServer(options, chartData, entrypoints, logger) {
  const viewer = readPatchedViewer();
  const html = renderPatchedViewer({
    chartData,
    defaultSizes: options.defaultSizes,
    entrypoints,
    mode: 'server',
    title: options.title,
  });
  const publicRoot = path.dirname(require.resolve('webpack-bundle-analyzer/public/viewer.js'));
  const sirv = require('sirv');
  const publicMiddleware = sirv(publicRoot, { dev: true });

  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }

    if (req.method === 'GET' && req.url === '/viewer.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(viewer);
      return;
    }

    publicMiddleware(req, res);
  });

  server.listen(options.port, options.host, () => {
    const url = 'http://' + options.host + ':' + options.port;
    logger.info('Webpack Bundle Analyzer is started at ' + url + '\nUse Ctrl+C to close it');

    if (options.open) {
      openReport(url, logger);
    }
  });
}

function runAnalyzer(options, stats, bundleDir) {
  const Logger = require('webpack-bundle-analyzer/lib/Logger');
  const logger = new Logger();
  const chartData = getChartData(stats, bundleDir, logger);
  const entrypoints = getEntrypoints(stats);

  if (options.mode === 'static') {
    writeStaticReport(options, chartData, entrypoints, logger);
    return;
  }

  if (options.mode === 'json') {
    writeJsonReport(options, chartData, logger);
    return;
  }

  startServer(options, chartData, entrypoints, logger);
}

const options = parseArgs(process.argv.slice(2));
const metafile = readMetafile(options.statsPath);
const bundleDir = findBundleDir(options.statsPath, options.bundleDir);
const analyzerBundleDir = prepareAnalyzerBundleDir(options.statsPath);
const webpackStats = toWebpackStats(metafile, bundleDir, analyzerBundleDir);

writeWebpackStats(options, webpackStats);
runAnalyzer(options, webpackStats, analyzerBundleDir);
