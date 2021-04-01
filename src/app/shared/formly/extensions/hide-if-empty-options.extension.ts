import { FormlyExtension } from '@ngx-formly/core';
import { isObservable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Extension that automatically hides select fields when their options are empty.
 */
export const hideIfEmptyOptionsExtension: FormlyExtension = {
  prePopulate(field): void {
    if (field.type !== 'ish-select-field') {
      return;
    }
    field.expressionProperties = {
      ...field.expressionProperties,
      hide: (isObservable(field.templateOptions.options)
        ? field.templateOptions.options
        : of(field.templateOptions.options)
      ).pipe(map(options => options?.length === 0)),
    };
  },
};
