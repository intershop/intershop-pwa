import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReplaySubject, combineLatest, defer, from, of } from 'rxjs';
import { catchError, first, map, switchMap, take, tap } from 'rxjs/operators';

import { NGRX_STATE_SK, STATE_ACTION_TYPE } from './configurations/ngrx-state-transfer';
import { SSR_LOCALE } from './configurations/state-keys';
import { getServerTranslations, loadServerTranslations } from './store/core/configuration';
import { whenTruthy } from './utils/operators';
import {
  FALLBACK_LANG,
  FallbackMissingTranslationHandler,
} from './utils/translate/fallback-missing-translation-handler';

export type Translations = Record<string, string | Record<string, string>>;

@Injectable()
class ICMTranslateLoader implements TranslateLoader {
  private initialized$ = new ReplaySubject(1);

  constructor(private store: Store, actions: Actions, transferState: TransferState) {
    const actionType = transferState.hasKey(NGRX_STATE_SK) ? STATE_ACTION_TYPE : ROOT_EFFECTS_INIT;
    actions.pipe(ofType(actionType), first()).subscribe(() => {
      this.initialized$.next(true);
    });
  }

  getTranslation(lang: string) {
    const local$ = defer(() => from(import(`../../assets/i18n/${lang}.json`)).pipe(catchError(() => of({}))));
    const server$ = this.store.pipe(
      select(getServerTranslations(lang)),
      tap(translations => {
        if (!translations) {
          this.store.dispatch(loadServerTranslations({ lang }));
        }
      }),
      whenTruthy(),
      take(1)
    );
    return this.initialized$.pipe(
      switchMap(() =>
        combineLatest([local$, server$]).pipe(
          map(([localTranslations, serverTranslations]) => ({
            ...localTranslations,
            ...serverTranslations,
          }))
        )
      )
    );
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
