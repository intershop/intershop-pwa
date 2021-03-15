import { createSelector } from '@ngrx/store';

import { getGeneralState } from 'ish-core/store/general/general-store';

const getServerConfigState = createSelector(getGeneralState, state => state.serverConfig);

const getServerConfig = createSelector(getServerConfigState, state => state._config);

export const isServerConfigurationLoaded = createSelector(getServerConfig, serverConfig => !!serverConfig);

export const getServerConfigParameter = <T>(path: string) =>
  createSelector(
    getServerConfig,
    (serverConfig): T =>
      (path
        .split('.')
        .reduce((obj, key) => (obj?.[key] !== undefined ? obj[key] : undefined), serverConfig) as unknown) as T
  );
