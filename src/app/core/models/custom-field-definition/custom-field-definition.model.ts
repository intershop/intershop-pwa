export type CustomFieldDefinitionScopes = 'Basket' | 'BasketLineItem' | 'Order' | 'OrderLineItem';

export interface CustomFieldDefinitionScopeType {
  name: string;
  editable?: boolean;
}

type Scopes = Record<CustomFieldDefinitionScopes | string, CustomFieldDefinitionScopeType[]>;

export interface CustomFieldDefinition {
  description: string;
  displayName: string;
  name: string;
  type: 'String';
}

export type CustomFieldDefinitionEntities = Record<string, CustomFieldDefinition>;

export interface CustomFieldDefinitions {
  scopes: Scopes;
  entities: CustomFieldDefinitionEntities;
}
