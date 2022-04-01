const fs = require('fs');
const { parse, stringify } = require('comment-json');
const { execSync } = require('child_process');
const glob = require('glob');

const savedConfigs = {};

function restoreConfigs() {
  Object.entries(savedConfigs).forEach(([key, config]) => {
    console.log('restoring', key);
    fs.writeFileSync(key, config);
  });
}

process.on('SIGINT', () => {
  restoreConfigs();
  process.exit(1);
});

glob.sync('**/.eslintrc.json', { ignore: ['node_modules/**'] }).forEach(eslintConfigPath => {
  const eslintConfig = fs.readFileSync(eslintConfigPath, { encoding: 'UTF-8' });

  const eslintJson = parse(eslintConfig);
  if (eslintJson.overrides) {
    console.log('modifying', eslintConfigPath);
    savedConfigs[eslintConfigPath] = eslintConfig;

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

    fs.writeFileSync(eslintConfigPath, stringify(eslintJson, null, 2));
  }
});

let command = 'npm run lint';

if (process.argv.length > 2) {
  command = 'npx eslint ' + process.argv.slice(2).join(' ');
}

let foundError = false;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  foundError = true;
} finally {
  restoreConfigs();
}

if (foundError) {
  process.exit(1);
}
