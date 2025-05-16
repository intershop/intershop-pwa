import { writeFileSync } from 'fs';
import globModule from 'glob';
import { basename, extname } from 'path';

const rules = {};
const { sync } = globModule;

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
