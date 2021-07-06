import { FormlyConfig, FormlyExtension, FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';

type PostWrapper = string | { index: number; wrapper: string };

/**
 * Extension that enables appending wrappers to the default configuration.
 * It uses the templateOptions.postWrappers to modify a fields wrappers without overriding them.
 */
class PostWrappersExtension implements FormlyExtension {
  constructor(private formlyConfig: FormlyConfig) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to: FormlyTemplateOptions & { postWrappers?: PostWrapper[] } = field.templateOptions;
    if (!to?.postWrappers || to.postWrappers.length === 0) {
      return;
    }
    const wrappers = this.formlyConfig.getType(field.type).wrappers;
    field.wrappers = [...wrappers, ...(to.postWrappers.filter(w => typeof w === 'string') as string[])];
    to.postWrappers
      .filter(w => typeof w !== 'string')
      .forEach((wrapper: { index: number; wrapper: string }) => {
        field.wrappers.splice(wrapper.index, 0, wrapper.wrapper);
      });
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
