import { ErrorHandler, Inject, Injectable, InjectionToken } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateCompiler,
  TranslateLoader,
  TranslateParser,
} from '@ngx-translate/core';
import { memoize } from 'lodash-es';
import { EMPTY, concat, defer, iif, of } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { getSpecificServerTranslation, loadSingleServerTranslation } from 'ish-core/store/core/configuration';
import { InjectSingle } from 'ish-core/utils/injection';
import { whenTruthy } from 'ish-core/utils/operators';

export const FALLBACK_LANG = new InjectionToken<string>('fallbackTranslateLanguage');

@Injectable()
export class FallbackMissingTranslationHandler implements MissingTranslationHandler {
  constructor(
    private translateLoader: TranslateLoader,
    private translateCompiler: TranslateCompiler,
    private translateParser: TranslateParser,
    private errorHandler: ErrorHandler,
    @Inject(FALLBACK_LANG) private fallback: InjectSingle<typeof FALLBACK_LANG>,
    private store: Store
  ) {}

  private reportMissingTranslation = memoize<(lang: string, key: string) => void>(
    (lang, key) => {
      this.errorHandler.handleError(`missing translation in ${lang}: ${key}`);
    },
    (lang, key) => lang + key
  );

  private retrieveICMSpecificTranslation(lang: string, key: string) {
    return defer(() =>
      this.store.pipe(
        select(getSpecificServerTranslation(lang, key)),
        tap(translation => {
          if (translation === undefined) {
            this.store.dispatch(loadSingleServerTranslation({ lang, key }));
          }
        }),
        filter(translation => translation !== undefined),
        map((translation: string) => this.translateCompiler.compile(translation, lang)),
        take(1)
      )
    );
  }

  private retrieveOtherSpecificTranslation(lang: string, key: string) {
    return this.translateLoader.getTranslation(lang).pipe(
      map(translations => translations?.[key]),
      map(translation => this.translateCompiler.compile(translation, lang)),
      tap(translation => {
        if (!translation) {
          this.reportMissingTranslation(lang, key);
        }
      }),
      take(1)
    );
  }

  handle(params: MissingTranslationHandlerParams) {
    // to consider localization keys being an actual key they need to have at least 10 characters and the tested dotted format without spaces
    if (params.key.length >= 10 && /^\w+(\.[\w-]+)+$/.test(params.key)) {
      const currentLang = params.translateService.currentLang;
      /*
       * When changing languages 'currentLang' from the translate service is out of sync with its loaded
       * translations -- only report a missing translation when the translations for the current language
       * are actually loaded but the key is genuinely absent. While the translations are still loading
       * (e.g. during SSR or a language switch) the language's translations object is not yet available,
       * so reporting would be a false positive.
       */
      const translations = params.translateService.translations?.[currentLang];
      if (translations && !translations[params.key]) {
        this.reportMissingTranslation(currentLang, params.key);
      }

      const doSingleCheck = !SSR && /\berror\b/.test(params.key);
      const isFallbackAvailable = currentLang !== this.fallback;
      return concat(
        // try API call with specific key
        iif(() => doSingleCheck, this.retrieveICMSpecificTranslation(currentLang, params.key), EMPTY),
        // try fallback translations
        iif(() => isFallbackAvailable, this.retrieveOtherSpecificTranslation(this.fallback, params.key), EMPTY),
        // try API call with fallback translation
        iif(
          () => isFallbackAvailable && doSingleCheck,
          this.retrieveICMSpecificTranslation(this.fallback, params.key),
          EMPTY
        ),
        // give up
        of(params.key)
      ).pipe(
        // stop after first emission
        whenTruthy(),
        take(1),
        map(translation => this.translateParser.interpolate(translation, params.interpolateParams)),
        map(translation => (PRODUCTION_MODE ? translation : `TRANSLATE_ME ${translation}`))
      );
    }
    return params.key;
  }
}
