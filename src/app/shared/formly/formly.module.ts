import { Provider } from '@angular/core';
import { ConfigOption, provideFormlyConfig } from '@ngx-formly/core';

import { provideIshFormlyExtensions } from './extensions/extensions.module';
import { provideIshFormlyFieldLibrary } from './field-library/field-library.module';
import { provideIshFormlyTypes } from './types/types.module';
import { provideIshFormlyWrappers } from './wrappers/wrappers.module';

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
