if (process.env.CI) {
  console.log('skipping creation of environment.local.ts');
  process.exit(0);
}

const fs = require('fs');

const force = process.argv.length > 2 && process.argv[2] === '-f';
const environmentLocalPath = 'src/environments/environment.local.ts';

if (!fs.existsSync(environmentLocalPath) || force) {
  if (fs.existsSync(environmentLocalPath)) {
    const environmentLocalBackupPath = environmentLocalPath + '.bak';
    console.log('creating backup ' + environmentLocalBackupPath);
    fs.renameSync(environmentLocalPath, environmentLocalBackupPath);
  }

  console.log('writing ' + environmentLocalPath);

  fs.writeFileSync(
    environmentLocalPath,
    `import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

// tslint:disable

// running out of memory?
// NODE_OPTIONS=--max_old_space_size=8192

const b2b = 0;

const extraFeatures: typeof environment.features =
  // default
  b2b ? ['advancedVariationHandling', 'businessCustomerRegistration', 'quoting', 'quickorder', 'orderTemplates'] : ['wishlists'];
  // none
  // [];

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  production: false,
  serviceWorker: false,
  mockServerAPI: false,
  defaultDeviceType: 'desktop',

  icmBaseURL: 'https://intershoppwa.azurewebsites.net',
  icmChannel: b2b ? 'inSPIRED-inTRONICS_Business-Site' : 'inSPIRED-inTRONICS-Site',

  theme: b2b ? 'blue' : 'default',

  features: [
    'compare',
    'recently',
    'rating',
    ...extraFeatures
  ],
};
`
  );
}
