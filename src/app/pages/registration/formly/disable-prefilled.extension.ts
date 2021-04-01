import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * This extension disables all fields that have keys that match those
 * specified in the formstate.disabled property
 */
type FieldConfigWithDisabled = Omit<FormlyFieldConfig, 'options'> & { options: { formState: { disabled: string[] } } };

export const disablePrefilledExtension: FormlyExtension = {
  prePopulate: field => {
    if (hasDisabled(field) && field.key) {
      field.templateOptions = { ...field.templateOptions };
      field.templateOptions.disabled = field.options.formState.disabled.includes(field.key as string);
    }
  },
};

function hasDisabled(field: FormlyFieldConfig): field is FieldConfigWithDisabled {
  return (
    Array.isArray(field.options?.formState?.disabled) &&
    // tslint:disable-next-line: no-any
    (field.options.formState.disabled as any[]).reduce((acc, val) => acc && typeof val === 'string', true)
  );
}
