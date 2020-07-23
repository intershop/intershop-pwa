const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');
const { Project, ts } = require('ts-morph');

if (process.argv.length < 3) {
  console.warn('required argument missing, provide true or false');
  process.exit(1);
}

const enable = process.argv[2].toLowerCase() === 'true';
console.log('setting serviceWorker to', enable);

// replace in angular.json
const angularJson = parse(fs.readFileSync('./angular.json', { encoding: 'UTF-8' }));
const project = Object.keys(angularJson.projects)[0];
const build = angularJson.projects[project].architect.build;

if (build.options.serviceWorker !== undefined) {
  build.options.serviceWorker = enable;
}

Object.keys(build.configurations).forEach(key => {
  const configuration = build.configurations[key];
  if (configuration.serviceWorker !== undefined) {
    configuration.serviceWorker = enable;
  }
});

fs.writeFileSync('./angular.json', stringify(angularJson, null, 2));
execSync('npx prettier --write angular.json');

// replace in environments
const tsMorphProject = new Project();
tsMorphProject.addSourceFilesAtPaths('src/environments/environment*.ts');

tsMorphProject
  .getSourceFiles()
  .filter(file => !file.getBaseName().endsWith('.model.ts') && file.getBaseName() !== 'environment.ts')
  .forEach(file => {
    file
      .forEachDescendantAsArray()
      .filter(stm => stm.getKind() == ts.SyntaxKind.VariableDeclaration && stm.getName() === 'environment')
      .map(stm => stm.getInitializer())
      .forEach(objectLiteralExpression => {
        const property = objectLiteralExpression.getProperty('serviceWorker');
        if (property) {
          property.setInitializer(`${enable}`);
        }
      });
  });

tsMorphProject.saveSync();
execSync('npx prettier --write src/environments/*.*');
