import type { Target } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';

import { version } from '../../package.json';

import { activeThemes, getBuildConfigurations, getSingleConfiguration, modes } from './build-configuration';

const buildDate = new Date();

interface BuilderOptions {
  buildTarget?: string;
}

export default (builderOptions: BuilderOptions, target: Target): Plugin => {
  const configurations = getBuildConfigurations(builderOptions, target);
  const theme = getSingleConfiguration(configurations, activeThemes, 'theme');
  const mode = getSingleConfiguration(configurations, modes, 'mode');
  const production = mode === 'production';
  process.env.PURGE_CSS ??= String(production);
  const serviceWorker = false;
  const pwaVersion = `${version} built ${buildDate} - configuration:${theme},${mode} service-worker:${serviceWorker}`;

  return {
    name: 'define-build-constants',
    setup(build) {
      build.initialOptions.define = {
        ...build.initialOptions.define,
        NGRX_RUNTIME_CHECKS: String(process.env.TESTING === 'true' || !production),
        PRODUCTION_MODE: String(production),
        PWA_VERSION: JSON.stringify(pwaVersion),
        SERVICE_WORKER: String(serviceWorker),
        SSR: String(build.initialOptions.platform === 'node'),
        THEME: JSON.stringify(theme),
      };
    },
  };
};
