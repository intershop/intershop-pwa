import { CustomFieldDefinitionScopes } from './server-config.interface';

export type CustomFieldDefinitionScopeType = {
  name: string;
  editable?: boolean;
};

interface Scopes {
  [key: CustomFieldDefinitionScopes | string]: CustomFieldDefinitionScopeType[];
}

export type CustomFieldDefinition = {
  description: string;
  displayName: string;
  name: string;
  type: 'String';
};

interface Entities {
  [key: string]: CustomFieldDefinition;
}

export interface CustomFieldDefinitions {
  scopes: Scopes;
  entities: Entities;
}

/**
 * model for config data (parameters, services etc.) retrieved from the ICM server.
 */
export interface ServerConfig {
  [key: string]: string | boolean | string[] | ServerConfig;
}
