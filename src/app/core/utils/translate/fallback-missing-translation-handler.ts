import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateParser,
} from '@ngx-translate/core';
import { memoize } from 'lodash-es';
import { concat, defer, iif, of } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

import { getSpecificServerTranslation, loadSingleServerTranslation } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

export const FALLBACK_LANG = new InjectionToken<string>('fallbackTranslateLanguage');

@Injectable()
export class FallbackMissingTranslationHandler implements MissingTranslationHandler {
  constructor(
    private parser: TranslateParser,
    private translateLoader: TranslateLoader,
    private errorHandler: ErrorHandler,
    @Inject(FALLBACK_LANG) private fallback: string,
    @Inject(PLATFORM_ID) private platformId: string,
    private store: Store
  ) {}

  private reportMissingTranslation = memoize<(lang: string, key: string) => void>(
    (lang, key) => {
      this.errorHandler.handleError(`missing translation in ${lang}: ${key}`);
    },
    (lang, key) => lang + key
  );

  private retrieveSpecificTranslation(lang: string, key: string) {
    return defer(() =>
      this.store.pipe(
        select(getSpecificServerTranslation(lang, key)),
        tap(translation => {
          if (translation === undefined) {
            this.store.dispatch(loadSingleServerTranslation({ lang, key }));
          }
        }),
        filter(translation => translation !== undefined),
        first()
      )
    );
  }

  handle(params: MissingTranslationHandlerParams) {
    if (params.interpolateParams || /^\w+(\.[\w-]+)+$/.test(params.key)) {
      this.reportMissingTranslation(params.translateService.currentLang, params.key);

      const doSingleCheck = isPlatformBrowser(this.platformId) && /\berror\b/.test(params.key);
      const isFallbackAvailable = params.translateService.currentLang !== this.fallback;
      return concat(
        // try API call with specific key
        iif(() => doSingleCheck, this.retrieveSpecificTranslation(params.translateService.currentLang, params.key)),
        // try fallback translations
        iif(
          () => isFallbackAvailable,
          this.translateLoader.getTranslation(this.fallback).pipe(
            map(translations => translations?.[params.key]),
            tap(translation => {
              if (!translation) {
                this.reportMissingTranslation(this.fallback, params.key);
              }
            }),
            first()
          )
        ),
        // try API call with fallback translation
        iif(() => isFallbackAvailable && doSingleCheck, this.retrieveSpecificTranslation(this.fallback, params.key)),
        // give up
        of(params.key)
      ).pipe(
        // stop after first emission
        whenTruthy(),
        first(),
        map(translation => this.parser.interpolate(translation, params.interpolateParams)),
        map(translation => (PRODUCTION_MODE ? translation : 'TRANSLATE_ME ' + translation))
      );
    }
    return params.key;
  }
}
