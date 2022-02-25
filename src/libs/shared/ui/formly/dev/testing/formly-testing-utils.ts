import { FormlyFieldConfig } from '@ngx-formly/core';

type ValueOrArray<T> = T | ValueOrArray<T>[];

export function extractKeys(fieldConfig: FormlyFieldConfig[]): ValueOrArray<string> {
  if (!fieldConfig) {
    return;
  }
  return fieldConfig.map(field => (field.key as string) ?? extractKeys(field.fieldGroup)).filter(value => !!value);
}
