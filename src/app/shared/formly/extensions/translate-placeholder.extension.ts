import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Extension to translate the templateOptions.placeholder.
 * Uses the TranslateService and replaces the placeholder with the translated version.
 */
class TranslatePlaceholderExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions;
    if (!to || !to.placeholder) {
      return;
    }

    field.templateOptions.placeholder = this.translate.instant(to.placeholder);
  }
}

export function registerTranslatePlaceholderExtension(translate: TranslateService) {
  return {
    extensions: [
      {
        name: 'translate-placeholder',
        extension: new TranslatePlaceholderExtension(translate),
      },
    ],
  };
}
