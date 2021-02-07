const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');
const { Project, ts } = require('ts-morph');

if (process.argv.length < 3) {
  console.warn('required prefix argument missing');
  process.exit(1);
}

const prefix = process.argv[2];

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = Object.keys(angularJson.projects)[0];
angularJson.projects[project].prefix = prefix;

if (prefix != 'ish') {
  // add style definition in angular.json
  const styles = angularJson.projects[project].architect.build.options.styles;
  if (!styles.find(style => style.bundleName === prefix)) {
    styles.push({
      input: `src/styles/themes/${prefix}/style.scss`,
      inject: false,
      bundleName: prefix,
    });
  }

  // add style definition files
  if (!fs.existsSync(`src/styles/themes/${prefix}`)) {
    execSync(`npx ncp src/styles/themes/default src/styles/themes/${prefix} --stopOnErr`);
  }
}

angularJson.projects[project].architect.build.configurations[prefix] = {};
angularJson.projects[project].architect.serve.configurations[prefix] = {
  browserTarget: 'intershop-pwa:build:' + prefix,
};
angularJson.projects[project].architect.server.configurations[prefix] = {};

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
execSync('npx prettier --write angular.json');

// replace in tslint.json
// "directive-selector": [true, "attribute", "ish", "camelCase"],
// "component-selector": [true, "element", "ish", "kebab-case"],

const addPrefix = (target, prefix) => {
  if (typeof target[2] === 'string') {
    target[2] = ['ish'];
  }
  target[2].push(prefix);
  target[2] = target[2].filter((val, idx, arr) => arr.indexOf(val) === idx);
};

const tslintJson = parse(fs.readFileSync('./tslint.json', { encoding: 'UTF-8' }));
addPrefix(tslintJson.rules['directive-selector'], prefix);
addPrefix(tslintJson.rules['component-selector'], prefix);
fs.writeFileSync('./tslint.json', stringify(tslintJson, null, 2));
execSync('npx prettier --write tslint.json');

// set default theme
const tsMorphProject = new Project();
tsMorphProject.addSourceFilesAtPaths('src/environments/environment*.ts');

tsMorphProject
  .getSourceFiles()
  .filter(file => !file.getBaseName().includes('.model.'))
  .forEach(file => {
    file
      .forEachDescendantAsArray()
      .filter(stm => stm.getKind() == ts.SyntaxKind.VariableDeclaration && stm.getName() === 'environment')
      .map(stm => stm.getInitializer())
      // .filter(ole => !ole.getProperty('theme'))
      .forEach(objectLiteralExpression => {
        const property = objectLiteralExpression.getProperty('theme');
        if (property) {
          if (prefix === 'ish') {
            property.remove();
          } else {
            property.setInitializer(`'${prefix}'`);
          }
        } else {
          objectLiteralExpression.addPropertyAssignment({
            name: 'theme',
            initializer: `'${prefix}'`,
          });
        }
      });
  });

tsMorphProject.saveSync();
execSync('npx prettier --write src/environments/*.*');
