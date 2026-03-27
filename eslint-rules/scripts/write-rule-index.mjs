import { writeFileSync } from 'fs';
import { globSync } from 'glob';
import { basename, extname } from 'path';

const rules = {};

globSync('src/rules/**/*.ts').forEach(file => {
  const ruleName = basename(file).replace(extname(file), '');
  const ruleImportPath = `./src/rules/${basename(file).replace(extname(file), '.js')}`;
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
