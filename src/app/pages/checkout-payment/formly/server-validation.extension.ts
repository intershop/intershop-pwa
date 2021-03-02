import { FormControl } from '@angular/forms';
import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Extension to enable server-side validation.
 * It accesses the formstate with two properties: errors and changedSinceErrors.
 * If these are set for a property, it will have an error.
 * To use this extension, set the formState in the relevant component.
 */
export const serverValidationExtension: FormlyExtension = {
  prePopulate: field => {
    if (field.hide) {
      return;
    }
    field.templateOptions = {
      ...field.templateOptions,
      showValidation: (fld: FormlyFieldConfig) =>
        field.formControl?.valid &&
        field.formControl?.dirty &&
        !field.options.formState.changedSinceErrors?.[fld.key as string],
    };

    field.validators = {
      ...field.validators,
      serverError: (_: FormControl, fld: FormlyFieldConfig) =>
        !(
          fld.options.formState.errors?.[fld.key as string] &&
          fld.options.formState.changedSinceErrors?.[fld.key as string] === false
        ),
    };

    field.validation = {
      ...field.validation,
      messages: {
        ...field.validation?.messages,
        serverError: '',
      },
    };

    field.expressionProperties = {
      ...field.expressionProperties,
      'validation.messages.serverError': (_, formState) => formState.errors?.[field.key as string],
    };
  },
};
