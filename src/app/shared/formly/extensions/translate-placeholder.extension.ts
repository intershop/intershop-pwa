import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { of, race } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

/**
 * Extension to translate the props.placeholder.
 * Uses the TranslateService and replaces the placeholder with the translated version.
 */
class TranslatePlaceholderExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const props = field.props;
    if (!props?.placeholder) {
      return;
    }

    race(
      // wait till service has loaded translations
      this.translate.get(props.placeholder).pipe(filter(value => value !== props.placeholder)),
      // abort if translation was not found
      of(props.placeholder).pipe(delay(1000))
    ).subscribe(translation => {
      field.props.placeholder = translation;
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
