import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule, TransferState } from '@angular/core';
import {
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { SSR_LOCALE } from './configurations/state-keys';
import {
  FALLBACK_LANG,
  FallbackMissingTranslationHandler,
} from './utils/translate/fallback-missing-translation-handler';
import { ICMTranslateLoader, LOCAL_TRANSLATIONS } from './utils/translate/icm-translate-loader';
import { PWATranslateCompiler } from './utils/translate/pwa-translate-compiler';
import { TranslationGenerator } from './utils/translate/translations-generator';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: ICMTranslateLoader },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: FallbackMissingTranslationHandler },
      useDefaultLang: false,
      compiler: { provide: TranslateCompiler, useClass: PWATranslateCompiler },
    }),
  ],
  providers: [
    { provide: FALLBACK_LANG, useValue: 'en_US' },
    {
      provide: LOCAL_TRANSLATIONS,
      useValue: {
        useFactory: (lang: string) => {
          switch (lang) {
            case 'en_US':
              return import('../../assets/i18n/en_US.json');
            case 'fr_FR':
              return import('../../assets/i18n/fr_FR.json');
            case 'de_DE':
              return import('../../assets/i18n/de_DE.json');
          }
        },
      },
    },
    TranslationGenerator,
  ],
})
export class InternationalizationModule {
  constructor(
    @Inject(LOCALE_ID) angularDefaultLocale: string,
    translateService: TranslateService,
    transferState: TransferState,
    generator: TranslationGenerator
  ) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    let defaultLang = angularDefaultLocale.replace(/\-/, '_');
    if (transferState.hasKey(SSR_LOCALE)) {
      defaultLang = transferState.get(SSR_LOCALE, defaultLang);
    }
    translateService.setDefaultLang(defaultLang);
    translateService.use(defaultLang);

    generator.init();
  }
}
