import { targetFromTargetString, type Target } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';

import { config, version } from '../../package.json';

const buildDate = new Date();

interface BuilderOptions {
  buildTarget?: string;
}

// Derived from the `config.active-themes` registry in package.json so new themes need no change here.
const themes = config['active-themes']
  .split(',')
  .map(theme => theme.trim())
  .filter(Boolean);

const modes = ['development', 'production'] as const;

// Falls back to the first active theme in production so no theme name is hardcoded.
const defaultConfiguration = `${themes[0]},production`;

function getBuildConfigurations(builderOptions: BuilderOptions, target: Target): Set<string> {
  const selectedConfiguration = builderOptions.buildTarget
    ? targetFromTargetString(builderOptions.buildTarget).configuration
    : target.configuration;
  const configuration = selectedConfiguration || defaultConfiguration;

  return new Set(configuration.split(',').filter(Boolean));
}

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
  const configurations = getBuildConfigurations(builderOptions, target);
  const theme = getSingleConfiguration(configurations, themes, 'theme');
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
