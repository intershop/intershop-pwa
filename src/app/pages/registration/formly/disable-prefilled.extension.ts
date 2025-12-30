import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

type FieldConfigWithDisabled = Omit<FormlyFieldConfig, 'options'> & { options: { formState: { disabled: string[] } } };

/**
 * Extension that disables all fields that have keys that match those
 * specified in the formstate.disabled property
 */
export const disablePrefilledExtension: FormlyExtension = {
  onPopulate(field) {
    if (hasDisabled(field) && field.key) {
      field.props = { ...field.props };
      field.props.disabled = field.options.formState.disabled.includes(field.key as string);
    }
  },
};

function hasDisabled(field: FormlyFieldConfig): field is FieldConfigWithDisabled {
  return (
    Array.isArray(field.options?.formState?.disabled) &&
    (field.options.formState.disabled as []).reduce((acc, val) => acc && typeof val === 'string', true)
  );
}
