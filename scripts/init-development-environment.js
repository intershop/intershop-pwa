const fs = require('fs');

const force = process.argv.length > 2 && process.argv.slice(2).find(arg => arg === '-f' || arg === '--force');
const empty = process.argv.length > 2 && process.argv.slice(2).find(arg => arg === '--empty');

const envDevPath = 'src/environments/environment.development.ts';
const envDevTemplatePath = 'src/environments/environment.development.ts.template';

/** @type string */
let envDevTemplate;
if (fs.existsSync(envDevTemplatePath)) {
  envDevTemplate = fs.readFileSync(envDevTemplatePath, 'utf8');
} else {
  envDevTemplate = `import { Environment } from "./environment.model";

/* eslint-disable */

// running out of memory?
// NODE_OPTIONS=--max_old_space_size=8192

export const overrides: Partial<Environment> = {
  // icmBaseURL: 'http://localhost:8081'

  // defaultDeviceType: 'desktop',

  // features: ['compare'],
};
`;
}

if (empty) {
  console.log('writing empty ' + envDevPath);

  fs.writeFileSync(
    envDevPath,
    `import { Environment } from "./environment.model";

export const overrides: Partial<Environment> = {};
`
  );
} else if (!fs.existsSync(envDevPath) || force) {
  if (fs.existsSync(envDevPath)) {
    const environmentLocalBackupPath = envDevPath + '.bak';
    console.log('creating backup ' + environmentLocalBackupPath);
    fs.renameSync(envDevPath, environmentLocalBackupPath);
  }

  console.log('writing ' + envDevPath);

  fs.writeFileSync(envDevPath, envDevTemplate);
} else {
  console.log('not overwriting existing ' + envDevPath);
}
