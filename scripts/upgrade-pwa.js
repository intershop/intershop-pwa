const { execSync, spawnSync } = require('child_process');
const fs = require('fs');

const pinned = {
  bootstrap: '4', // pinned
  '@ng-bootstrap/ng-bootstrap': '11', // 12 requires Bootstrap 5
  '@types/node': '16', // LTS
  '@cspell/dict-de-de': '1.1.32', // later versions use the GPL license
  jest: '28',
  '@types/jest': '28',
  '@ngx-formly/core': '5',
};

// <HELPERS>

const parseVersion = version => {
  if (version.startsWith('~')) {
    return /~([0-9]+\.[0-9]+)\.[0-9]+/.exec(version)[1];
  } else if (version.startsWith('^')) {
    return /\^([0-9]+)\.[0-9]+\.[0-9]+/.exec(version)[1];
  }
  return version;
};

const execute = command => {
  console.log(`## ${command}`);
  execSync(command, { stdio: 'inherit' });
};

const modifyPackageJson = cb => {
  const { parse, stringify } = require('comment-json');
  const packageJson = cb(parse(fs.readFileSync('./package.json', { encoding: 'UTF-8' })));
  fs.writeFileSync('./package.json', stringify(packageJson, null, 2) + '\n');
  execute('npx prettier --write package.json');
};

const commit = message => {
  execute(`git commit -a --allow-empty -m "${message}"`, { stdio: 'inherit' });
};

const angularCoreDependencies = ['zone.js', 'tslib', 'rxjs', 'typescript'];

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// </HELPERS>

// synchronize node_modules in working copy
execute('npm ci');

// deactivate full postinstall
let install;
modifyPackageJson(packageJson => {
  install = packageJson.scripts.postinstall;
  packageJson.scripts.postinstall = '';
  return packageJson;
});
commit('chore: temporarily deactivate full postinstall');

// upgrade core libraries
console.log('upgrade @schematics/angular to find compatible versions');
execute('npx ng update @schematics/angular');

const { latestVersions } = require('@schematics/angular/utility/latest-versions');
angularCoreDependencies.forEach(dep => {
  pinned[dep] = parseVersion(latestVersions[dep]);
});

const coreLibs = [
  '@schematics/angular',
  '@angular/cli',
  '@angular/cdk',
  '@angular/core',
  '@ngrx/store',
  '@nguniversal/express-engine',
  '@angular-builders/custom-webpack',
  '@rx-angular/state',
  '@phenomnomnominal/tsquery',
  '@types/node',
  '@types/webpack',
  ...angularCoreDependencies,
].map(lib => (pinned[lib] ? lib + '@' + pinned[lib] : lib));

console.log('update core libraries');
execute('npx ng update -C --force --allow-dirty ' + coreLibs.join(' '));

// reactivate postinstall
modifyPackageJson(packageJson => {
  packageJson.scripts.postinstall = install;
  return packageJson;
});
commit('chore: reactivate full postinstall');

// update all remaining libraries
const libs = Object.keys(JSON.parse(spawnSync(NPM, ['outdated', '--json']).stdout.toString('utf-8')))
  // prettier upgrades should be done separately
  .filter(lib => lib !== 'prettier')
  .map(lib => (pinned[lib] ? `${lib}@${pinned[lib]}` : lib));
execute('npx ng update -C --force ' + libs.join(' '));

// rewrite package-lock.json (just in case)
execute('npx rimraf package-lock.json node_modules');
execute('npm install --force');
commit('chore: synchronize package-lock.json');

// check if pinned versions in package.json start with pinned values
const packageLockJson = JSON.parse(fs.readFileSync('./package-lock.json', { encoding: 'utf-8' }));
modifyPackageJson(packageJson => {
  Object.entries(pinned).forEach(([dep, version]) => {
    const write = packageLockJson.dependencies[dep].version;
    if (!write.startsWith(version)) {
      console.warn('####### something went wrong #######');
      console.warn(`package ${dep} was not pinned down correctly to version ${version} and is now on version ${write}`);
      console.warn('some dependency upgrade must have pulled a newer version');
      console.warn('####################################');
    }
  });
  return packageJson;
});

console.warn('###### Known dependency incompatibilities:');
spawnSync(NPM, ['ls', '-a'])
  .stderr.toString('utf-8')
  .split('\n')
  .filter((v, i, a) => a.indexOf(v) === i)
  .forEach(line => {
    console.warn(line);
  });

console.warn('###### Not upgraded:');
console.log(spawnSync(NPM, ['outdated']).stdout.toString('utf-8'));
