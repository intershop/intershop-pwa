import { FormlyConfig, FormlyExtension, FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';

/**
 * Extension that enables appending wrappers to the default configuration.
 * It uses the templateOptions.postWrappers to modify a fields wrappers without overriding them.
 */
class PostWrappersExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to: FormlyTemplateOptions & { postWrappers?: string[] } = field.templateOptions;
    if (!to?.postWrappers || to.postWrappers.length === 0) {
      return;
    }
    field.wrappers = [...(this.formlyConfig.getType(field.type)?.wrappers ?? []), ...to.postWrappers];
  }
}

export function registerPostWrappersExtension(formlyConfig: FormlyConfig) {
  return {
    extensions: [
      {
        name: 'post-wrappers',
        extension: new PostWrappersExtension(formlyConfig),
      },
    ],
  };
}
