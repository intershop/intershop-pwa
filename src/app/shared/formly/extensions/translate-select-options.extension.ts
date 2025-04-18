import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isObservable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * Extension to translate the props.options and add a placeholder element.
 *
 * @props  **options**  defines options to be shown as key value pairs. Accepts two types:
 * * `` { value: any; label: string}[]``
 * * `` Observable<{ value: any; label: string}[]>``
 * @props **placeholder** - is used to add a placeholder element. This will also be translated.
 * @props **optionsTranslateDisabled** - disables options label translation (placeholder is still translated).
 *
 * @usageNotes
 * It will use the TranslateService to translate option labels.
 */
class TranslateSelectOptionsExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const props = field.props || {};
    if (!props.options) {
      return;
    }

    field.expressions = {
      ...(field.expressions || {}),
      'props.options': (isObservable(props.options) ? props.options : of(props.options)).pipe(
        map(options =>
          (props.placeholder ? [{ value: '', label: this.translate.instant(props.placeholder) }] : []).concat(
            options ?? []
          )
        ),
        tap(() => {
          if (props.placeholder && !field.formControl.value && !field.model[field.key as string]) {
            field.formControl.setValue('');
          }
        }),
        map(options =>
          options?.map(option =>
            props.optionsTranslateDisabled ? option : { ...option, label: this.translate.instant(option.label) }
          )
        )
      ),
    };
  }
}

export function registerTranslateSelectOptionsExtension(translate: TranslateService) {
  return {
    extensions: [
      {
        name: 'translate-select-options',
        extension: new TranslateSelectOptionsExtension(translate),
      },
    ],
  };
}
