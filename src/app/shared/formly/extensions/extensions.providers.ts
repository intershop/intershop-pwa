import { Provider } from '@angular/core';
import { FORMLY_CONFIG, FormlyConfig, provideFormlyConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

import { hideIfEmptyOptionsExtension } from './hide-if-empty-options.extension';
import { registerPostWrappersExtension } from './post-wrappers-extension';
import { registerTranslatePlaceholderExtension } from './translate-placeholder.extension';
import { registerTranslateSelectOptionsExtension } from './translate-select-options.extension';

export function provideIshFormlyExtensions(): Provider[] {
  return [
    provideFormlyConfig({
      extensions: [{ name: 'hide-if-empty-options-extension', extension: hideIfEmptyOptionsExtension }],
    }),
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateSelectOptionsExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslatePlaceholderExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerPostWrappersExtension,
      deps: [FormlyConfig],
    },
  ];
}

export class ExtensionsModule {}
