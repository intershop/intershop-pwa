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

for (const file of args.length ? project.getSourceFiles(args) : project.getSourceFiles()) {
  if (!file.getFilePath().endsWith('.spec.ts')) {
    continue;
  }

  const copyPath = file.getFilePath() + '.ut.spec.ts';
  let foundSomething = false;

  console.log(`at ${path(file)}`);

  top: while (true) {
    if (
      tsquery(
        file.getSourceFile().compilerNode,
        'PropertyAccessExpression[expression.text=TestBed][name.text=configureTestingModule]'
      ).length
    ) {
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
