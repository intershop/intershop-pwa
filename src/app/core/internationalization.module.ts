import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule, TransferState } from '@angular/core';
import {
  TranslateService,
  provideMissingTranslationHandler,
  provideTranslateCompiler,
  provideTranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';

import { SSR_LOCALE } from './configurations/state-keys';
import { InjectSingle } from './utils/injection';
import {
  FALLBACK_LANG,
  FallbackMissingTranslationHandler,
} from './utils/translate/fallback-missing-translation-handler';
import { ICMTranslateLoader, LOCAL_TRANSLATIONS } from './utils/translate/icm-translate-loader';
import { PWATranslateCompiler } from './utils/translate/pwa-translate-compiler';
import { TranslationGenerator } from './utils/translate/translations-generator';

@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
    provideTranslateService({
      loader: provideTranslateLoader(ICMTranslateLoader),
      missingTranslationHandler: provideMissingTranslationHandler(FallbackMissingTranslationHandler),
      compiler: provideTranslateCompiler(PWATranslateCompiler),
    }),
    {
      provide: FALLBACK_LANG,
      useFactory: (locale: string) => locale.replace(/-/g, '_'),
      deps: [LOCALE_ID],
    },
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
    @Inject(FALLBACK_LANG) fallbackLang: InjectSingle<typeof FALLBACK_LANG>,
    translateService: TranslateService,
    transferState: TransferState,
    generator: TranslationGenerator
  ) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    const defaultLang = transferState.hasKey(SSR_LOCALE) ? transferState.get(SSR_LOCALE, fallbackLang) : fallbackLang;
    translateService.setFallbackLang(defaultLang);
    translateService.use(defaultLang);

    generator.init();
  }
}
