import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { of, race } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

/**
 * Extension to translate the templateOptions.placeholder.
 * Uses the TranslateService and replaces the placeholder with the translated version.
 */
class TranslatePlaceholderExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions;
    if (!to?.placeholder) {
      return;
    }

    race(
      // wait till service has loaded translations
      this.translate.get(to.placeholder).pipe(filter(value => value !== to.placeholder)),
      // abort if translation was not found
      of(to.placeholder).pipe(delay(1000))
    ).subscribe(translation => {
      field.templateOptions.placeholder = translation;
    });
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
