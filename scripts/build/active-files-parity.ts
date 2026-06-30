import * as fs from 'fs';
import { join } from 'path';

/* eslint-disable no-console */

interface CliOptions {
  applicationReport: string;
  examples: number;
  webpackReport: string;
}

const DEFAULT_APPLICATION_REPORT = join('dist', 'application-builder', 'browser', 'active-files.json');

const DEFAULT_WEBPACK_REPORT = join('dist', 'browser', 'active-files.json');

function parseArgs(args: string[]): CliOptions {
  return args.reduce<CliOptions>(
    (options, arg) => {
      if (arg.startsWith('--application=')) {
        return { ...options, applicationReport: arg.split('=')[1] };
      }
      if (arg.startsWith('--webpack=')) {
        return { ...options, webpackReport: arg.split('=')[1] };
      }
      if (arg.startsWith('--examples=')) {
        return { ...options, examples: Number(arg.split('=')[1]) };
      }
      return options;
    },
    {
      applicationReport: process.env.npm_config_application || DEFAULT_APPLICATION_REPORT,
      examples: process.env.npm_config_examples ? Number(process.env.npm_config_examples) : 25,
      webpackReport: process.env.npm_config_webpack || DEFAULT_WEBPACK_REPORT,
    }
  );
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\.\//, '');
}

function readActiveFilesReport(path: string): string[] {
  if (!fs.existsSync(path)) {
    throw new Error(`Missing active-files report: ${path}`);
  }

  const report = JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' })) as unknown;
  if (!Array.isArray(report) || !report.every(file => typeof file === 'string')) {
    throw new Error(`Invalid active-files report: ${path}`);
  }

  return [...new Set(report.map(normalizePath))].sort();
}

function difference(left: string[], right: Set<string>): string[] {
  return left.filter(file => !right.has(file));
}

function formatExamples(files: string[], limit: number): string[] {
  return files.slice(0, limit).map(file => `  - ${file}`);
}

function assertActiveFilesParity(options: CliOptions) {
  const webpackFiles = readActiveFilesReport(options.webpackReport);
  const applicationFiles = readActiveFilesReport(options.applicationReport);
  const webpackSet = new Set(webpackFiles);
  const applicationSet = new Set(applicationFiles);
  const missingInApplication = difference(webpackFiles, applicationSet);
  const applicationOnly = difference(applicationFiles, webpackSet);

  console.log(
    JSON.stringify(
      {
        application: {
          files: applicationFiles.length,
          report: options.applicationReport,
        },
        applicationOnly: applicationOnly.length,
        missingInApplication: missingInApplication.length,
        webpack: {
          files: webpackFiles.length,
          report: options.webpackReport,
        },
      },
      undefined,
      2
    )
  );

  if (missingInApplication.length || applicationOnly.length) {
    throw new Error(
      [
        'active-files reports differ.',
        `Missing in application (${missingInApplication.length}):`,
        ...formatExamples(missingInApplication, options.examples),
        `Only in application (${applicationOnly.length}):`,
        ...formatExamples(applicationOnly, options.examples),
      ].join('\n')
    );
  }
}

function run() {
  assertActiveFilesParity(parseArgs(process.argv.slice(2)));
}

run();
