import { ErrorHandler, Inject, Injectable, InjectionToken, LOCALE_ID, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslateService,
} from '@ngx-translate/core';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, switchMapTo } from 'rxjs/operators';

import { SSR_LOCALE } from './configurations/state-keys';

@Injectable()
class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(language: string): Observable<unknown> {
    return of(language).pipe(
      map(lang => {
        switch (lang) {
          case 'de_DE':
            return import('@angular/common/locales/global/de');
          case 'fr_FR':
            return import('@angular/common/locales/global/fr');
        }
      }),
      switchMap(imp => {
        const translations$ = from(import(`../../assets/i18n/${language}.json`));
        return imp ? from(imp).pipe(switchMapTo(translations$)) : translations$;
      })
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
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: FallbackMissingTranslationHandler },
      useDefaultLang: false,
    }),
  ],
  providers: [{ provide: FALLBACK_LANG, useValue: 'en_US' }],
})
export class InternationalizationModule {
  constructor(
    transferState: TransferState,
    translateService: TranslateService,
    @Inject(LOCALE_ID) angularDefaultLocale: string
  ) {
    let defaultLang = angularDefaultLocale.replace(/\-/, '_');
    if (transferState.hasKey(SSR_LOCALE)) {
      defaultLang = transferState.get(SSR_LOCALE, defaultLang);
    }
    translateService.setDefaultLang(defaultLang);
    translateService.use(defaultLang);
  }
}
