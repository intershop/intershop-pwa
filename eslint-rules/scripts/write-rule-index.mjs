import { strings } from '@angular-devkit/core';
import { writeFileSync } from 'fs';
import glob from 'glob';
import { basename, extname } from 'path';

const rules = {};

glob.sync('src/rules/**/*.ts').forEach(file => {
  const ruleName = basename(file).replace(extname(file), '');
  const ruleImportPath = `./rules/${basename(file).replace(extname(file), '.js')}`;
  const ruleImportName = strings.camelize(ruleName);
  rules[ruleName] = `require('${ruleImportPath}').${ruleImportName}Rule`;
});

writeFileSync(
  'dist/index.js',
  `module.exports = {
  rules: {
    ${Object.entries(rules)
      .map(([rule, imp]) => `'${rule}': ${imp}`)
      .join(',\n    ')}
  },
};
`
);
