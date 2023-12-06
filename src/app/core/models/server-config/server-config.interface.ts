export type CustomFieldDefinitionScopes = 'Basket' | 'BasketLineItem' | 'Order' | 'OrderLineItem';

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

export interface ServerConfigDataEntry {
  customFieldDefinitions?: CustomFieldDefinitionsData[];
  [key: string]: string | boolean | number | string[] | ServerConfigDataEntry[] | ServerConfigDataEntry;
}

export interface ServerConfigData {
  data: ServerConfigDataEntry;
}
