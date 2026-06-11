import * as fs from 'fs';
import { join } from 'path';

/* eslint-disable no-console */

interface CliOptions {
  applicationPath: string;
  theme?: string;
  webpackPath: string;
}

interface FileGroupSummary {
  count: number;
  bytes: number;
}

interface ParitySummary {
  application: OutputSummary;
  theme?: string;
  webpack: OutputSummary;
}

interface OutputSummary {
  css: FileGroupSummary;
  index: {
    hasB2BAssets: boolean;
    hasB2CAssets: boolean;
    hasB2BThemeColor: boolean;
    hasB2CThemeColor: boolean;
    path?: string;
  };
  js: FileGroupSummary;
  path: string;
}

const DEFAULT_WEBPACK_PATH = join('dist', 'browser');

const DEFAULT_APPLICATION_PATH = join('dist', 'application-spike', 'browser');

function parseArgs(args: string[]): CliOptions {
  return args.reduce<CliOptions>(
    (options, arg) => {
      if (arg.startsWith('--webpack=')) {
        return { ...options, webpackPath: arg.split('=')[1] };
      }
      if (arg.startsWith('--application=')) {
        return { ...options, applicationPath: arg.split('=')[1] };
      }
      if (arg.startsWith('--theme=')) {
        return { ...options, theme: arg.split('=')[1] };
      }
      return options;
    },
    { applicationPath: DEFAULT_APPLICATION_PATH, webpackPath: DEFAULT_WEBPACK_PATH }
  );
}

function getFiles(path: string): string[] {
  if (!fs.existsSync(path)) {
    return [];
  }

  return fs.readdirSync(path).map(file => join(path, file));
}

function summarizeFiles(path: string, extension: string): FileGroupSummary {
  const files = getFiles(path).filter(file => file.endsWith(extension));
  return {
    bytes: files.reduce((sum, file) => sum + fs.statSync(file).size, 0),
    count: files.length,
  };
}

function findIndex(path: string): string | undefined {
  return ['index.html', 'index.csr.html'].map(indexFile => join(path, indexFile)).find(file => fs.existsSync(file));
}

function summarizeOutput(path: string): OutputSummary {
  const indexPath = findIndex(path);
  const index = indexPath ? fs.readFileSync(indexPath, { encoding: 'utf-8' }) : '';

  return {
    css: summarizeFiles(path, '.css'),
    index: {
      hasB2BAssets: index.includes('assets/themes/b2b'),
      hasB2BThemeColor: index.includes('#006b99'),
      hasB2CAssets: index.includes('assets/themes/b2c'),
      hasB2CThemeColor: index.includes('#006f6f'),
      path: indexPath,
    },
    js: summarizeFiles(path, '.js'),
    path,
  };
}

function assertTheme(summary: OutputSummary, theme: string, label: string) {
  const hasExpectedTheme = theme === 'b2b' ? summary.index.hasB2BAssets : summary.index.hasB2CAssets;
  const hasOtherTheme = theme === 'b2b' ? summary.index.hasB2CAssets : summary.index.hasB2BAssets;

  if (!hasExpectedTheme) {
    throw new Error(`${label} output does not contain expected ${theme} assets in ${summary.index.path || 'index'}.`);
  }
  if (hasOtherTheme) {
    throw new Error(`${label} output also contains assets for the other theme in ${summary.index.path || 'index'}.`);
  }
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const summary: ParitySummary = {
    application: summarizeOutput(options.applicationPath),
    theme: options.theme,
    webpack: summarizeOutput(options.webpackPath),
  };

  if (options.theme) {
    assertTheme(summary.application, options.theme, 'Application builder spike');
    assertTheme(summary.webpack, options.theme, 'Webpack');
  }

  console.log(JSON.stringify(summary, undefined, 2));
}

run();
