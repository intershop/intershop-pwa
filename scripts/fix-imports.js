const { readFileSync } = require('fs');
const { Linter } = require('tslint');
const glob = require('glob');

const files = process.argv.length > 2 ? process.argv.splice(2) : glob.sync('src/**/*.ts');

const lintOptions = {
  fix: true,
  formatter: 'prose',
};

const linter = new Linter(lintOptions);
files.forEach(sourcePath =>
  linter.lint(sourcePath, readFileSync(sourcePath, { encoding: 'utf-8' }), {
    rules: new Map().set('ish-ordered-imports', true),
    rulesDirectory: ['node_modules/intershop-tslint-rules'],
    jsRules: new Map(),
    extends: [],
  })
);
