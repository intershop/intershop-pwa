import { FormlyExtension } from '@ngx-formly/core';

export const criticalDefaultValuesExtension: FormlyExtension = {
  prePopulate(field): void {
    if (field.validators?.validation) {
      return;
    }
    field.validators = {
      ...field.validators,
      validation: field.validators?.validation ?? [],
    };
  },
};
