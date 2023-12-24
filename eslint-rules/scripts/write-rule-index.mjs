import { writeFileSync } from 'fs';
import { sync } from 'glob';
import { basename, extname } from 'path';

const rules = {};

sync('src/rules/**/*.ts').forEach(file => {
  const ruleName = basename(file).replace(extname(file), '');
  const ruleImportPath = `./rules/${basename(file).replace(extname(file), '.js')}`;
  rules[ruleName] = `require('${ruleImportPath}').default`;
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
