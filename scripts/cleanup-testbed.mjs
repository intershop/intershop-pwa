import { execSync, spawnSync } from 'child_process';
import { copyFileSync, existsSync, statSync } from 'fs';
import glob from 'glob';
import minimatch from 'minimatch';
import runAll from 'npm-run-all';
import { cpus } from 'os';
import { basename, dirname, join, normalize, sep } from 'path';
import rimraf from 'rimraf';
import { Node, Project } from 'ts-morph';

/* eslint-disable no-console */

const args = process.argv.splice(2).filter(a => !a.startsWith('--'));

const isHelp = args.includes('--help') || args.includes('-h');

const isRelated = args.includes('--related') || process.env.npm_config_related === 'true';

if (isHelp) {
  process.stderr.write(`  Utility for removing unused TestBed declarations.

  Usage: npm run cleanup-testbed [git-rev|folder|file [file...]]

    When used without an argument, all project files
    ending in '.spec.ts' are used as input for the cleanup.

    When git-rev is supplied, a git diff against the provided
    rev is performed and test files are interpolated. This is
    useful in CI.

      Examples:
        npm run cleanup-testbed HEAD~2
        npm run cleanup-testbed origin/develop

    When a folder is supplied, all files ending in '.spec.ts'
    are used as input for the cleanup. This works like the
    variant without arguments, but only on a subfolder.

      Examples:
        npm run cleanup-testbed src/app/shell

    When used with one or more files as input, those files are
    input for the cleanup.

    Whenever multiple files are provided, the process forks
    individual processes to do the cleanup on individual files.
    The concurrency is based on the number of available cores.
    It can be customized using the TESTBED_CLEANUP_MAX_WORKERS
    environment variable.

`);
  process.exit(0);
}

const jestProjects = '{src,projects}/**';
const jestPattern = '**/*.spec.ts';
const jestPathPattern = jestProjects.substring(0, jestProjects.lastIndexOf('/') + 1) + jestPattern;

function findTests(args) {
  const normalizedArgs = args.map(f => normalize(f));
  let interpolatedTests;
  if (isRelated) {
    interpolatedTests = spawnSync('npx', [
      'jest',
      '--findRelatedTests',
      '--listTests',
      ...normalizedArgs.map(f => (f.endsWith('.html') ? f.replace(/\.html$/, '.ts') : f)),
    ])
      .stdout.toString()
      .split('\n')
      .filter(f => !!f.trim())
      .map(f => f.replace(process.cwd() + sep, ''));
  } else {
    interpolatedTests = normalizedArgs.map(f => (f.endsWith('.spec.ts') ? f : f.replace(/\.(ts|html)$/, '.spec.ts')));
  }
  return interpolatedTests
    .filter(f => minimatch(f, jestPathPattern) && existsSync(f) && statSync(f).isFile())
    .filter((v, i, a) => a.indexOf(v) === i);
}

function isTestBedConfigure(node) {
  return (
    Node.isPropertyAccessExpression(node) &&
    node.getExpression().getText() === 'TestBed' &&
    node.getName() === 'configureTestingModule'
  );
}

let files;

if (args.length === 0) {
  console.log('searching for tests in project');
  files = glob.sync(jestPathPattern, { ignore: ['node_modules/**'] });
} else if (args.length === 1) {
  const normalizedPath = normalize(args[0]);
  let statRes;
  try {
    statRes = statSync(normalizedPath);
  } catch (err) {
    console.warn(`File "${normalizedPath}" doesn't exist.`);
  }
  if (!minimatch(normalizedPath, jestProjects)) {
    console.log('using', args[0], 'as git-rev');
    files = findTests(spawnSync('git', ['--no-pager', 'diff', args[0], '--name-only']).stdout.toString().split('\n'));
  } else if (statRes?.isDirectory()) {
    console.log('using', args[0], 'as folder');
    files = glob.sync(join(args[0], jestPattern));
  } else if (statRes?.isFile()) {
    files = findTests(args);
  } else {
    console.error('cannot interpret argument as git revision, folder or test file');
    process.exit(1);
  }
} else {
  files = findTests(args);
}

if (!files.length) {
  console.log('did not find any test files');
} else if (files.length > 1) {
  console.log(`found ${files.length} test files`);

  const cores = +process.env.TESTBED_CLEANUP_MAX_WORKERS || Math.round(cpus().length / 2) || 1;
  if (cores > 1) {
    console.log(`Using ${cores} cores for testbed cleanup.`);
  }

  const tasks = files.map(file => `cleanup-testbed ${file.replace(/\\/g, '/')}`);

  runAll(tasks, {
    parallel: cores > 1,
    maxParallel: cores,
    silent: true,
    stdout: process.stdout,
    stderr: process.stderr,
  }).then(results => {
    if (results.some(r => r.code !== 0)) {
      process.exit(1);
    } else {
      console.log(`cleaned up ${files.length} test files`);
    }
  });
} else {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.all.json',
    skipFileDependencyResolution: true,
    skipAddingFilesFromTsConfig: true,
  });
  const file = project.addSourceFileAtPath(files[0]);

  let foundSomething = false;

  const copyPath = `${file.getFilePath()}.ut.spec.ts`;
  const filePath = file.getFilePath().replace(process.cwd().replace(/\\/g, '/'), '').substring(1);
  const copySnapshotPath = join(dirname(copyPath), '__snapshots__', `${basename(copyPath)}.snap`);
  const fileSnapshotPath = join(dirname(filePath), '__snapshots__', `${basename(filePath)}.snap`);

  if (!file.getText().includes('configureTestingModule')) {
    console.log(`at ${filePath}`, 0, `tests`);
  } else {
    const configs = [];

    let tb = 0;
    project.forgetNodesCreatedInBlock(() => {
      file.forEachDescendant(node => {
        if (Node.isCallExpression(node) && isTestBedConfigure(node.getExpression())) {
          const configObject = node.getArguments().find(Node.isObjectLiteralExpression);
          if (configObject) {
            for (const type of ['declarations', 'providers', 'imports']) {
              const array = configObject.getProperty(type);
              if (Node.isPropertyAssignment(array)) {
                const initializer = array.getInitializer();
                if (Node.isArrayLiteralExpression(initializer)) {
                  for (let index = initializer.getElements().length - 1; index >= 0; index--) {
                    configs.push({ tb, type, index });
                  }
                }
              }
            }
          }
          tb++;
        }
      });
    });

    console.log(`at ${filePath}`, configs.length, `test${configs.length !== 1 ? 's' : ''}`);

    next: for (const config of configs) {
      tb = -1;
      const copy = file.getSourceFile().copyImmediatelySync(copyPath, { overwrite: true });

      // write snapshot file of copy
      if (existsSync(fileSnapshotPath) && !existsSync(copySnapshotPath)) {
        copyFileSync(fileSnapshotPath, copySnapshotPath);
      }

      for (const node of copy.forEachDescendantAsArray()) {
        if (Node.isCallExpression(node) && isTestBedConfigure(node.getExpression())) {
          tb++;
          if (tb === config.tb) {
            const configObject = node.getArguments().find(Node.isObjectLiteralExpression);
            if (configObject) {
              const array = configObject.getProperty(config.type);
              if (Node.isPropertyAssignment(array)) {
                const initializer = array.getInitializer();
                if (Node.isArrayLiteralExpression(initializer)) {
                  const element = initializer.getElements()[config.index]?.getText();

                  if (initializer.getElements().length === 1) {
                    array.remove();
                  } else {
                    initializer.removeElement(config.index);
                  }
                  copy.saveSync();

                  try {
                    execSync(`npx jest --ci -i ${copy.getFilePath()}`, {
                      stdio: 'ignore',
                      timeout: 60000,
                      killSignal: 'SIGKILL',
                    });
                    console.log(`${filePath} - removing '${element}' from ${config.type} in TestBed #${config.tb + 1}`);
                    copy.copyImmediatelySync(file.getFilePath(), { overwrite: true });
                    foundSomething = true;

                    break;
                  } catch (err) {
                    continue next;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  rimraf.sync(copyPath);
  rimraf.sync(copySnapshotPath);

  if (foundSomething) {
    execSync(`npx eslint --fix ${filePath}`);
  }
}
