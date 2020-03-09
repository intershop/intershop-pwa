const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');

const tslintJson = parse(fs.readFileSync('./tslint.json', { encoding: 'UTF-8' }));

Object.keys(tslintJson.rules)
  .filter(key => key !== 'no-disabled-tests')
  .forEach(key => {
    if (
      typeof tslintJson.rules[key] === 'object' &&
      tslintJson.rules[key].severity &&
      tslintJson.rules[key].severity.startsWith('warn')
    ) {
      tslintJson.rules[key].severity = 'error';
    }
  });

fs.writeFileSync('./tslint.json', stringify(tslintJson, null, 2));
execSync('npx prettier --write tslint.json');
