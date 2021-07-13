const force = process.argv.length > 2 && process.argv.slice(2).find(arg => arg === '-f' || arg === '--force');
const empty = process.argv.length > 2 && process.argv.slice(2).find(arg => arg === '--empty');

const environmentLocalPath = 'src/environments/environment.local.ts';

const fs = require('fs');

if (empty) {
  console.log('writing empty ' + environmentLocalPath);

  fs.writeFileSync(
    environmentLocalPath,
    `import { Environment } from "./environment.model";

export const overrides: Partial<Environment> = {};
`
  );
} else if (!fs.existsSync(environmentLocalPath) || force) {
  if (fs.existsSync(environmentLocalPath)) {
    const environmentLocalBackupPath = environmentLocalPath + '.bak';
    console.log('creating backup ' + environmentLocalBackupPath);
    fs.renameSync(environmentLocalPath, environmentLocalBackupPath);
  }

  console.log('writing ' + environmentLocalPath);

  fs.writeFileSync(
    environmentLocalPath,
    `import { Environment } from "./environment.model";

// tslint:disable

// running out of memory?
// NODE_OPTIONS=--max_old_space_size=8192

export const overrides: Partial<Environment> = {
  // icmBaseURL: 'http://localhost:8081'

  // defaultDeviceType: 'desktop',

  // features: ['compare'],
};
`
  );
} else {
  console.log('not overwriting existing ' + environmentLocalPath);
}
