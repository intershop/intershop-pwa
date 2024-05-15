import { CustomFieldDefinitionsData } from 'ish-core/models/custom-field-definition/custom-field-definition.interface';

export interface ServerConfigDataEntry {
  customFieldDefinitions?: CustomFieldDefinitionsData[];
  [key: string]: string | boolean | number | string[] | ServerConfigDataEntry[] | ServerConfigDataEntry;
}

export interface ServerConfigData {
  data: ServerConfigDataEntry;
}
