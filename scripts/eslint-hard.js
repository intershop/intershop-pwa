const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');

const eslintJson = parse(fs.readFileSync('./.eslintrc.json', { encoding: 'UTF-8' }));

eslintJson.overrides.forEach((overrideObject, index) => {
  Object.keys(overrideObject.rules)
    .filter(k => k !== 'jest/no-disabled-tests')
    .forEach(key => {
      let ruleInfo = eslintJson.overrides[index].rules[key];
      if (typeof ruleInfo === 'string' && ruleInfo === 'warn') {
        eslintJson.overrides[index].rules[key] = 'error';
      } else if (ruleInfo?.[0] === 'warn') {
        eslintJson.overrides[index].rules[key][0] = 'error';
      }
    });
});

fs.writeFileSync('./.eslintrc.json', stringify(eslintJson, null, 2));
execSync('npx prettier --write .eslintrc.json');
