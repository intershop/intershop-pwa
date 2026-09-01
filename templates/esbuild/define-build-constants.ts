import { targetFromTargetString, type Target } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import {
  getSelectedConfigurationNames,
  readAngularWorkspace,
  resolveTheme,
} from 'intershop-builders/dist/theme-configuration.js';

import { version } from '../../package.json';

const buildDate = new Date();

interface BuilderOptions {
  buildTarget?: string;
}

const modes = ['development', 'production'] as const;

function getSingleConfiguration<const T extends string>(
  configurations: Set<string>,
  candidates: readonly T[],
  type: string
): T {
  const selected = candidates.filter(candidate => configurations.has(candidate));

  if (selected.length !== 1) {
    throw new Error(
      `Expected exactly one ${type} configuration (${candidates.join(', ')}), found: ${selected.join(', ')}`
    );
  }

  return selected[0];
}

export default (builderOptions: BuilderOptions, target: Target): Plugin => {
  const selectedTarget = builderOptions.buildTarget ? targetFromTargetString(builderOptions.buildTarget) : target;
  const workspace = readAngularWorkspace(process.cwd());
  const configurations = new Set(getSelectedConfigurationNames(workspace, selectedTarget));
  if (![...configurations].some(configuration => modes.includes(configuration as (typeof modes)[number]))) {
    configurations.add('production');
  }
  const theme = resolveTheme(workspace, selectedTarget).theme;
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
