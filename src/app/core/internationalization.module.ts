import { isPlatformServer, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule, PLATFORM_ID, isDevMode } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import {
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { TRANSLATE_LOADER_FORMAT, TRANSLATE_LOADER_URL } from './configurations/injection-keys';
import { SSR_LOCALE } from './configurations/state-keys';
import { LocalizationsService } from './services/localizations/localizations.service';
import { ExternalTranslateLoader } from './utils/translate/external-translate-loader';
import {
  FALLBACK_LANG,
  FallbackMissingTranslationHandler,
} from './utils/translate/fallback-missing-translation-handler';
import { ICMTranslateLoader } from './utils/translate/icm-translate-loader';
import { PWATranslateCompiler } from './utils/translate/pwa-translate-compiler';
import { TranslationGenerator } from './utils/translate/translations-generator';

const TRANSLATE_LOADER_URL_SK = makeStateKey<string>('translateLoaderUrl');

const TRANSLATE_LOADER_FORMAT_SK = makeStateKey<string>('translateLoaderFormat');

export function translateLoaderFactory(
  transferState: TransferState,
  platformId: string,
  localizations: LocalizationsService,
  http: HttpClient,
  translateLoaderUrl: string,
  translateLoaderFormat: string
) {
  if (isPlatformServer(platformId) || isDevMode()) {
    const url = (typeof process !== 'undefined' && process.env.TRANSLATE_LOADER_URL) || translateLoaderUrl;
    if (url) {
      transferState.set(TRANSLATE_LOADER_URL_SK, url);
    }
    const format = (typeof process !== 'undefined' && process.env.TRANSLATE_LOADER_FORMAT) || translateLoaderFormat;
    if (format) {
      transferState.set(TRANSLATE_LOADER_FORMAT_SK, format);
    }
  }

  if (transferState.hasKey(TRANSLATE_LOADER_URL_SK)) {
    let url = transferState.get(TRANSLATE_LOADER_URL_SK, '/TRANSLATE_LOADER_URL');
    let format = transferState.get(TRANSLATE_LOADER_FORMAT_SK, ExternalTranslateLoader.DEFAULT_FORMAT);
    return new ExternalTranslateLoader(http, url, format);
  }

  return new ICMTranslateLoader(transferState, platformId, localizations);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        /* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
        deps: [
          TransferState,
          PLATFORM_ID,
          LocalizationsService,
          HttpClient,
          TRANSLATE_LOADER_URL,
          TRANSLATE_LOADER_FORMAT,
        ],
        /* eslint-enable @angular-eslint/sort-ngmodule-metadata-arrays */
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: FallbackMissingTranslationHandler },
      useDefaultLang: false,
      compiler: { provide: TranslateCompiler, useClass: PWATranslateCompiler },
    }),
  ],
  providers: [{ provide: FALLBACK_LANG, useValue: 'en_US' }, TranslationGenerator],
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
