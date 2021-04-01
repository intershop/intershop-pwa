import { FormlyExtension } from '@ngx-formly/core';

/**
 * Extension that ensures the validators property is always filled.
 * This prevents some errors that come with undefined properties.
 */
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
