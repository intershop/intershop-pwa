import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import {
  EnvironmentProviders,
  LOCALE_ID,
  TransferState,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import {
  TranslateService,
  provideMissingTranslationHandler,
  provideTranslateCompiler,
  provideTranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';

import { SSR_LOCALE } from './configurations/state-keys';
import {
  FALLBACK_LANG,
  FallbackMissingTranslationHandler,
} from './utils/translate/fallback-missing-translation-handler';
import { ICMTranslateLoader, LOCAL_TRANSLATIONS } from './utils/translate/icm-translate-loader';
import { PWATranslateCompiler } from './utils/translate/pwa-translate-compiler';
import { TranslationGenerator } from './utils/translate/translations-generator';

function initializeInternationalization() {
  const angularDefaultLocale = inject(LOCALE_ID);
  const translateService = inject(TranslateService);
  const transferState = inject(TransferState);
  const generator = inject(TranslationGenerator);

  registerLocaleData(localeDe);
  registerLocaleData(localeFr);

  let defaultLang = angularDefaultLocale.replace(/-/, '_');
  if (transferState.hasKey(SSR_LOCALE)) {
    defaultLang = transferState.get(SSR_LOCALE, defaultLang);
  }
  translateService.setFallbackLang(defaultLang);
  translateService.use(defaultLang);

  generator.init();
}

export function provideInternationalization(): EnvironmentProviders {
  return makeEnvironmentProviders([
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
    provideAppInitializer(initializeInternationalization),
  ]);
}
