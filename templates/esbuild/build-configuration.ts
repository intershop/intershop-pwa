import { targetFromTargetString, type Target } from '@angular-devkit/architect';

import { config } from '../../package.json';

interface BuilderOptions {
  buildTarget?: string;
}

export const activeThemes = (process.env.npm_config_active_themes ?? config['active-themes'])
  .split(',')
  .filter(Boolean);

export const modes = ['development', 'production'] as const;

export function getBuildConfigurations(builderOptions: BuilderOptions, target: Target): Set<string> {
  const configuration = builderOptions.buildTarget
    ? targetFromTargetString(builderOptions.buildTarget).configuration
    : target.configuration;

  return new Set(configuration?.split(',').filter(Boolean));
}

export function getSingleConfiguration<const T extends string>(
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
