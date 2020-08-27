const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('This script requires a clean working copy and will fail otherwise.');
execSync('git diff-files --quiet');
execSync('npm run clean');

[...glob.sync('src/app/extensions/*/{shared,exports}/*/*'), ...glob.sync('projects/*/src/app/components/*/*')]
  .filter(f => fs.lstatSync(f).isDirectory())
  .forEach(source => {
    const cmpName = path.basename(source);
    const target = path.dirname(path.dirname(source)) + '/' + cmpName;
    execSync(`ng g move-component ${source} ${target}`, { stdio: 'inherit' });
  });
