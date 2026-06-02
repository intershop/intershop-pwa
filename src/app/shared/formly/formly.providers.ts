import { Provider } from '@angular/core';
import { ConfigOption, provideFormlyConfig } from '@ngx-formly/core';

import { provideIshFormlyExtensions } from './extensions/extensions.providers';
import { provideIshFormlyFieldLibrary } from './field-library/field-library.providers';
import { provideIshFormlyTypes } from './types/types.providers';
import { provideIshFormlyWrappers } from './wrappers/wrappers.providers';

const ishFormlyConfig: ConfigOption = {
  extras: {
    lazyRender: true,
    showError: field =>
      field.formControl?.invalid &&
      (field.formControl.dirty || field.options.parentForm?.submitted || !!field.field.validation?.show),
  },
};

export function provideIshFormly(): Provider[] {
  return [
    provideFormlyConfig(ishFormlyConfig),
    ...provideIshFormlyFieldLibrary(),
    ...provideIshFormlyExtensions(),
    ...provideIshFormlyTypes(),
    ...provideIshFormlyWrappers(),
  ];
}
