const fs = require('fs');
const { execSync } = require('child_process');

const eslintConfigPath = 'eslint.config.mjs';
let savedConfig = null;

function restoreConfig() {
  if (savedConfig) {
    console.log('restoring', eslintConfigPath);
    fs.writeFileSync(eslintConfigPath, savedConfig);
  }
}

process.on('SIGINT', () => {
  restoreConfig();
  process.exit(1);
});

const eslintConfig = fs.readFileSync(eslintConfigPath, { encoding: 'UTF-8' });
savedConfig = eslintConfig;

console.log('modifying', eslintConfigPath);

// Replace all 'warn' with 'error' in rules, except for jest/no-disabled-tests
const modifiedConfig = eslintConfig
  // Replace standalone 'warn' values (but not the string itself in other contexts)
  .replace(/^(\s*'[^']+':)\s*'warn'\s*,?\s*$/gm, (match, ruleKey) => {
    if (ruleKey.includes('jest/no-disabled-tests')) {
      return match;
    }
    return match.replace("'warn'", "'error'");
  })
  // Replace 'warn' in array configs like ['warn', ...]
  .replace(/^(\s*'[^']+':)\s*\[\s*'warn'/gm, (match, ruleKey) => {
    if (ruleKey.includes('jest/no-disabled-tests')) {
      return match;
    }
    return match.replace("'warn'", "'error'");
  });

fs.writeFileSync(eslintConfigPath, modifiedConfig);

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
  restoreConfig();
}

if (foundError) {
  process.exit(1);
}
