import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isObservable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

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

    let placeholderInitialized = false;

    field.expressions = {
      ...(field.expressions || {}),
      'props.options': (isObservable(props.options) ? props.options : of(props.options)).pipe(
        switchMap(options => {
          const allOptions = (props.placeholder ? [{ value: '', label: props.placeholder }] : []).concat(options ?? []);
          const translationKeys = (props.placeholder ? [props.placeholder] : []).concat(
            props.optionsTranslateDisabled ? [] : (options ?? []).map(o => o.label)
          );

          if (translationKeys.length === 0) {
            return of(allOptions);
          }

          return this.translate
            .get(translationKeys)
            .pipe(
              map(translations =>
                allOptions.map(option =>
                  props.optionsTranslateDisabled && option.value !== ''
                    ? option
                    : { ...option, label: translations[option.label] || option.label }
                )
              )
            );
        }),
        tap(() => {
          if (
            !placeholderInitialized &&
            props.placeholder &&
            !field.formControl.value &&
            !field.model[field.key as string]
          ) {
            field.formControl.setValue('');
            placeholderInitialized = true;
          }
        })
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
