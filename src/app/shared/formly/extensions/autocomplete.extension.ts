import { FormlyExtension } from '@ngx-formly/core';

/**
 * Extension that ensures the validators property is always filled.
 * This prevents some errors that come with undefined properties.
 */
export const autocompleteExtension: FormlyExtension = {
  prePopulate(field): void {
    const to = field.templateOptions;
    if (!to || !to.autocomplete) {
      return;
    }

    field.templateOptions.attributes = { autocomplete: to.autocomplete };
  },
};
