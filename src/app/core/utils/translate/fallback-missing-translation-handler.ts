import { ErrorHandler, Inject, Injectable, InjectionToken } from '@angular/core';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateParser,
} from '@ngx-translate/core';
import { map } from 'rxjs/operators';

export const FALLBACK_LANG = new InjectionToken<string>('fallbackTranslateLanguage');

@Injectable()
export class FallbackMissingTranslationHandler implements MissingTranslationHandler {
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
