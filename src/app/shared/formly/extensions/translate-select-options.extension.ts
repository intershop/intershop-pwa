import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isObservable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

/**
 * Extension to translate the props.options and add a placeholder element.
 *
 * @props  **options**  defines options to be shown as key value pairs. Accepts two types:
 * * `` { value: any; label: string}[]``
 * * `` Observable<{ value: any; label: string}[]>``
 * @props **placeholder** - is used to add a placeholder element. This will also be translated.
 *
 * @usageNotes
 * It will use the TranslateService to translate option labels.
 * These modified options are written to ``props.processedOptions``.
 */
class TranslateSelectOptionsExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const props = field.props;
    if (!props?.options) {
      return;
    }
    field.props.processedOptions = (isObservable(props.options) ? props.options : of(props.options)).pipe(
      startWith([]),
      map(options => (props.placeholder ? [{ value: '', label: props.placeholder }] : []).concat(options ?? [])),
      tap(() => {
        if (props.placeholder && !field.formControl.value && !field.model[field.key as string]) {
          field.formControl.setValue('');
        }
      }),
      map(options => options?.map(option => ({ ...option, label: this.translate.instant(option.label) })))
    );
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
