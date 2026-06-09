import { CustomFieldDefinitionsData } from 'ish-core/models/custom-field-definition/custom-field-definition.interface';

export interface ServerConfigDataEntry {
  customFieldDefinitions?: CustomFieldDefinitionsData[];
  [key: string]: boolean | number | ServerConfigDataEntry | ServerConfigDataEntry[] | string | string[];
}

export interface ServerConfigData {
  data: ServerConfigDataEntry;
}
