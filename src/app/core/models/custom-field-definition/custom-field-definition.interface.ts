import { ServerConfigDataEntry } from 'ish-core/models/server-config/server-config.interface';

import { CustomFieldDefinitionScopes } from './custom-field-definition.model';

export interface CustomFieldDefinitionsData extends ServerConfigDataEntry {
  description: string;
  displayName: string;
  name: string;
  position: number;
  type: 'String';
  scopes: {
    isEditable: boolean;
    isVisible: boolean;
    name: CustomFieldDefinitionScopes;
  }[];
}
