import { tsquery } from '@phenomnomnominal/tsquery';
import { execSync, spawnSync } from 'child_process';
import { LeftHandSideExpression, Node, Project, PropertyAccessExpression, SourceFile } from 'ts-morph';

// tslint:disable: no-console

function isTestBedConfigure(node: LeftHandSideExpression): node is PropertyAccessExpression {
  return (
    Node.isPropertyAccessExpression(node) &&
    node.getExpression().getText() === 'TestBed' &&
    node.getName() === 'configureTestingModule'
  );
}

function path(file: SourceFile): string {
  return file.getFilePath().replace(process.cwd(), '').substring(1);
}

const project = new Project({ tsConfigFilePath: 'tsconfig.all.json' });

let args = process.argv.splice(2);

if (args.length === 1 && !(args[0].startsWith('src') || args[0].includes('/src/'))) {
  args = spawnSync('git', ['--no-pager', 'diff', args[0], '--name-only']).stdout.toString().split('\n');
}

args = [
  ...args.filter(f => f.endsWith('.spec.ts')),
  ...args.filter(f => !f.endsWith('.spec.ts')).map(file => file.replace(/\.(ts|html)$/, '.spec.ts')),
].filter((v, i, a) => a.indexOf(v) === i);

let files = args.length ? project.getSourceFiles(args) : project.getSourceFiles();

files = files.filter(f => f.getBaseName().endsWith('.spec.ts'));

console.log(`found ${files.length} test file(s)`);

let processedFiles = 0;

for (const file of files) {
  processedFiles++;

  const copyPath = file.getFilePath() + '.ut.spec.ts';
  let foundSomething = false;

  top: while (true) {
    const percent = ((processedFiles / files.length) * 100).toFixed(0);

    if (
      !tsquery(
        file.getSourceFile().compilerNode,
        'PropertyAccessExpression[expression.text=TestBed][name.text=configureTestingModule]'
      ).length
    ) {
      console.log(`at ${percent}% - ${path(file)}`, 0, `test(s)`);
    } else {
      const configs: { tb: number; type: string; index: number }[] = [];

      let tb = 0;
      file.forEachDescendant(node => {
        if (Node.isCallExpression(node) && isTestBedConfigure(node.getExpression())) {
          const configObject = node.getArguments().find(Node.isObjectLiteralExpression);
          if (configObject) {
            for (const type of ['declarations', 'providers', 'imports']) {
              const array = configObject.getProperty(type);
              if (Node.isPropertyAssignment(array)) {
                const initializer = array.getInitializer();
                if (Node.isArrayLiteralExpression(initializer)) {
                  for (let index = 0; index < initializer.getElements().length; index++) {
                    configs.push({ tb, type, index });
                  }
                }
              }
            }
          }
          tb++;
        }
      });

      console.log(`at ${percent}% - ${path(file)}`, configs.length, `test(s)`);

      next: for (const config of configs) {
        tb = -1;
        const copy = file.getSourceFile().copyImmediatelySync(copyPath, { overwrite: true });

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
                    const element = initializer.getElements()[config.index].getText();

                    if (initializer.getElements().length === 1) {
                      array.remove();
                    } else {
                      initializer.removeElement(config.index);
                    }
                    copy.saveSync();

                    try {
                      execSync('npx jest -i ' + copy.getFilePath(), {
                        stdio: 'ignore',
                        timeout: 60000,
                        killSignal: 'SIGKILL',
                      });
                      console.log(
                        `${path(file)} - removing '${element}' from ${config.type} in TestBed #${config.tb + 1}`
                      );
                      copy.copyImmediatelySync(file.getFilePath(), { overwrite: true });
                      foundSomething = true;
                      continue top;
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
    break;
  }

  if (project.getSourceFile(copyPath)) {
    project.getSourceFile(copyPath).delete();
  }

  if (foundSomething) {
    const filePath = file.getFilePath();
    execSync('node scripts/fix-imports ' + filePath);
    try {
      execSync('npx prettier --write ' + filePath);
    } catch (err) {
      // do nothing
    }
  }
}

project.saveSync();
