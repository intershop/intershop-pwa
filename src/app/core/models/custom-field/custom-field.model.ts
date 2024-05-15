import { CustomFieldDefinitionScopeType } from 'ish-core/models/custom-field-definition/custom-field-definition.model';

type CustomFieldValue = string;

export type CustomFields = Record<string, CustomFieldValue>;

export type CustomFieldsComponentInput = CustomFieldDefinitionScopeType & {
  value: CustomFieldValue;
};
