const force = process.argv.length > 2 && process.argv[2] === '-f';

if (process.env.CI && !force) {
  console.log('skipping creation of environment.local.ts');
  process.exit(0);
}

const environmentLocalPath = 'src/environments/environment.local.ts';

const fs = require('fs');

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
  b2b ? ['advancedVariationHandling', 'businessCustomerRegistration', 'quoting', 'quickorder', 'orderTemplates', 'punchout'] : ['wishlists'];
  // none
  // [];

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  defaultDeviceType: 'desktop',

  icmBaseURL: 'https://pwa-ish-demo.test.intershop.com',
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
