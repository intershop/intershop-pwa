import { createSelector } from '@ngrx/store';

import { CustomFieldDefinitionScopes } from 'ish-core/models/server-config/server-config.interface';
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

const getExtraConfig = createSelector(getServerConfigState, state => state.extra);

export const isExtraConfigurationLoaded = createSelector(getExtraConfig, extraConfig => !!extraConfig);

export const getExtraConfigParameter = <T>(path: string) =>
  createSelector(
    getExtraConfig,
    (extraConfig): T =>
      path
        .split('.')
        .reduce((obj, key) => (obj?.[key] !== undefined ? obj[key] : undefined), extraConfig) as unknown as T
  );

const getCustomFieldDefinitions = createSelector(getServerConfigState, state => state._definitions);

export const getCustomFieldIdsForScope = (scope: CustomFieldDefinitionScopes) =>
  createSelector(getCustomFieldDefinitions, customFieldDefinitions => customFieldDefinitions?.scopes?.[scope] ?? []);

export const getCustomFieldsForScope = (scope: CustomFieldDefinitionScopes) =>
  createSelector(getCustomFieldDefinitions, getCustomFieldIdsForScope(scope), (customFieldDefinitions, ids) =>
    ids.map(({ name, editable }) => ({ name, editable, ...customFieldDefinitions?.entities?.[name] }))
  );

export const getCustomFieldDefinition = (name: string) =>
  createSelector(getCustomFieldDefinitions, customFieldDefinitions => customFieldDefinitions?.entities?.[name]);
