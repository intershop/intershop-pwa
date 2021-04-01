const { execSync, spawnSync } = require('child_process');

const pinned = {
  husky: '4', // 5 has a strange license
  '@types/node': '14', // LTS
  '@types/webpack': '4', // webpack.custom.js compatible version
};

const parseVersion = version => {
  if (version.startsWith('~')) {
    return /~([0-9]+\.[0-9]+)\.[0-9]+/.exec(version)[1];
  } else if (version.startsWith('^')) {
    return /\^([0-9]+)\.[0-9]+\.[0-9]+/.exec(version)[1];
  }
  return version;
};

const modifyPackageJson = (cb, message) => {
  const fs = require('fs');
  const { parse, stringify } = require('comment-json');
  const packageJson = cb(parse(fs.readFileSync('./package.json', { encoding: 'UTF-8' })));
  fs.writeFileSync('./package.json', stringify(packageJson, null, 2));
  if (message) execSync('git commit -a -m "' + message + '"', { stdio: 'inherit' });
};

// synchronize node_modules in working copy
execSync('npm ci', { stdio: 'inherit' });

// deactivate full postinstall
let install;
modifyPackageJson(packageJson => {
  install = packageJson.scripts.postinstall;
  packageJson.scripts.postinstall = 'postinstall';
  return packageJson;
}, 'chore: temporarily deactivate full postinstall');

// upgrade core libraries
console.log('upgrade @schematics/angular to find compatible versions');
execSync('npx ng update @schematics/angular', { stdio: 'inherit' });

const { latestVersions } = require('@schematics/angular/utility/latest-versions');
pinned['zone.js'] = parseVersion(latestVersions.ZoneJs);
pinned.typescript = parseVersion(latestVersions.TypeScript);
pinned.rxjs = parseVersion(latestVersions.RxJs);
pinned.tslib = parseVersion(latestVersions.TsLib);

coreLibs = [
  '@schematics/angular',
  '@angular/cli',
  '@angular/cdk',
  '@angular/core',
  '@ngrx/store',
  '@nguniversal/express-engine',
  '@angular-builders/custom-webpack',
  '@rx-angular/state',
  'codelyzer',
  '@phenomnomnominal/tsquery',
  '@types/node',
  '@types/webpack',
  'rxjs',
  'zone.js',
  'typescript',
  'tslib',
].map(lib => (pinned[lib] ? lib + '@' + pinned[lib] : lib));

console.log('update core libraries');
execSync('npx ng update -C --force --allow-dirty ' + coreLibs.join(' '), { stdio: 'inherit' });

// reactivate postinstall
modifyPackageJson(packageJson => {
  packageJson.scripts.postinstall = install;
  return packageJson;
}, 'chore: reactivate full postinstall');

// update all remaining libraries
const libs = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['outdated'])
  .stdout.toString('utf-8')
  .split('\n')
  .filter((_, idx) => idx > 0)
  .map(line => line.split(' ')[0])
  .filter(lib => !['zone.js', 'tslib', 'rxjs', 'typescript'].includes(lib))
  .map(lib => (pinned[lib] ? lib + '@' + pinned[lib] : lib));
execSync('npx ng update -C --force ' + libs.join(' '), { stdio: 'inherit' });

// rewrite package-lock.json (just in case)
execSync('npx rimraf package-lock.json', { stdio: 'inherit' });
execSync('npx rimraf ' + (process.platform === 'win32' ? '\\"node_modules/!(rimraf|.bin)\\"' : 'node_modules'), {
  stdio: 'inherit',
});
execSync('npm install', { stdio: 'inherit' });
execSync('git commit -a -m "chore: synchronize package-lock" --allow-empty', { stdio: 'inherit' });
