export type CustomFieldDefinitionScopes = 'Basket' | 'BasketLineItem' | 'Order' | 'OrderLineItem';

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

export interface CustomFieldDefinitionEntities {
  [key: string]: CustomFieldDefinition;
}

export interface CustomFieldDefinitions {
  scopes: Scopes;
  entities: CustomFieldDefinitionEntities;
}
