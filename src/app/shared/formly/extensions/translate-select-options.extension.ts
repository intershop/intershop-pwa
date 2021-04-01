import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isObservable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

/**
 * Extension to translate the templateOptions.options and add a placeholder element.
 * It will use the TranslateService to translate option labels.
 * Also, if templateOptions.placeholder is set, the extension will add a placeholder element.
 * These modified options are written to templateOptions.processedOptions.
 */
class TranslateSelectOptionsExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions;
    if (!to || !to.options) {
      return;
    }
    field.expressionProperties = {
      ...field.expressionProperties,
      'templateOptions.processedOptions': (model, _, fld) =>
        (isObservable(fld.templateOptions.options)
          ? fld.templateOptions.options
          : of(fld.templateOptions.options)
        ).pipe(
          startWith([]),
          map(options => (to.placeholder ? [{ value: '', label: to.placeholder }] : []).concat(options ?? [])),
          tap(() => {
            if (to.placeholder && !fld.formControl.value && !model[fld.key as string]) {
              fld.formControl.setValue('');
            }
          }),
          map(options => options?.map(option => ({ ...option, label: this.translate.instant(option.label) })))
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
