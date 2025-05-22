import { CustomFieldDefinitionScopeType } from 'ish-core/models/server-config/server-config.model';

type CustomFieldValue = string;

export type CustomFields = Record<string, CustomFieldValue>;

export type CustomFieldsComponentInput = CustomFieldDefinitionScopeType & {
  value: CustomFieldValue;
};
