import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core/core-store';

const getServerConfigState = createSelector(getCoreState, state => state.serverConfig);

export const getServerConfig = createSelector(getServerConfigState, state => state._config);

export const isServerConfigurationLoaded = createSelector(getServerConfig, serverConfig => !!serverConfig);

export const getServerConfigParameter = <T>(path: string) =>
  createSelector(
    getServerConfig,
    (serverConfig): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj?.[key] !== undefined ? obj[key] : undefined), serverConfig) as unknown as T
  );
