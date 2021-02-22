import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isObservable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

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
