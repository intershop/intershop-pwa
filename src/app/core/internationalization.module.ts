import { isPlatformBrowser, isPlatformServer, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, Inject, Injectable, InjectionToken, LOCALE_ID, NgModule, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslateService,
} from '@ngx-translate/core';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { SSR_LOCALE, SSR_TRANSLATIONS } from './configurations/state-keys';
import { getRestEndpoint } from './store/core/configuration';
import { whenTruthy } from './utils/operators';

export type Translations = Record<string, string | Record<string, string>>;

function maybeJSON(val: string) {
  if (val.startsWith('{')) {
    try {
      return JSON.parse(val);
    } catch {
      // default
    }
  }
  return val;
}

function filterAndTransformKeys(translations: Record<string, string>): Translations {
  return Object.entries(translations)
    .filter(([key]) => key.startsWith('pwa-'))
    .map(([key, value]) => [key.substring(4), maybeJSON(value)])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

@Injectable()
class ICMTranslateLoader implements TranslateLoader {
  constructor(
    private httpClient: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string,
    private store: Store
  ) {}

  getTranslation(lang: string) {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(SSR_TRANSLATIONS)) {
      return of(this.transferState.get(SSR_TRANSLATIONS, undefined));
    }
    const local$ = from(import(`../../assets/i18n/${lang}.json`)).pipe(catchError(() => of({})));
    return this.store.pipe(
      select(getRestEndpoint),
      whenTruthy(),
      take(1),
      switchMap(url =>
        this.httpClient.get(`${url};loc=${lang}/localizations`, {
          params: {
            searchKeys: 'pwa-',
          },
        })
      ),
      map(filterAndTransformKeys),
      withLatestFrom(local$),
      map(([translations, localTranslations]) => ({
        ...localTranslations,
        ...translations,
      })),
      tap((translations: Translations) => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(SSR_TRANSLATIONS, translations);
        }
      }),
      catchError(() => local$)
    );
  }
}

const FALLBACK_LANG = new InjectionToken<string>('fallbackTranslateLanguage');

@Injectable()
class FallbackMissingTranslationHandler implements MissingTranslationHandler {
  constructor(
    private parser: TranslateParser,
    private translateLoader: TranslateLoader,
    private errorHandler: ErrorHandler,
    @Inject(FALLBACK_LANG) private fallback: string
  ) {}

  handle(params: MissingTranslationHandlerParams) {
    if (params.interpolateParams || /^\w+(\.[\w-]+)+$/.test(params.key)) {
      this.errorHandler.handleError(`missing translation in ${params.translateService.currentLang}: ${params.key}`);
      if (params.translateService.currentLang !== this.fallback) {
        return this.translateLoader.getTranslation(this.fallback).pipe(
          map(translations => {
            if (translations[params.key]) {
              return this.parser.interpolate(translations[params.key], params.interpolateParams);
            }
            this.errorHandler.handleError(`missing translation in ${this.fallback}: ${params.key}`);
            return params.key;
          }),
          map(translation => (PRODUCTION_MODE ? translation : 'TRANSLATE_ME ' + translation))
        );
      }
    }
    return params.key;
  }
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: ICMTranslateLoader },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: FallbackMissingTranslationHandler },
      useDefaultLang: false,
    }),
  ],
  providers: [{ provide: FALLBACK_LANG, useValue: 'en_US' }],
})
export class InternationalizationModule {
  constructor(
    @Inject(LOCALE_ID) angularDefaultLocale: string,
    translateService: TranslateService,
    transferState: TransferState
  ) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    let defaultLang = angularDefaultLocale.replace(/\-/, '_');
    if (transferState.hasKey(SSR_LOCALE)) {
      defaultLang = transferState.get(SSR_LOCALE, defaultLang);
    }
    translateService.setDefaultLang(defaultLang);
    translateService.use(defaultLang);
  }
}
