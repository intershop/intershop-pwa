import { Injectable } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateLoader } from '@ngx-translate/core';
import { ReplaySubject, combineLatest, defer, from, of } from 'rxjs';
import { catchError, first, map, switchMap, take, tap } from 'rxjs/operators';

import { NGRX_STATE_SK, STATE_ACTION_TYPE } from 'ish-core/configurations/ngrx-state-transfer';
import { getServerTranslations, loadServerTranslations } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class ICMTranslateLoader implements TranslateLoader {
  private initialized$ = new ReplaySubject(1);

  constructor(private store: Store, actions: Actions, transferState: TransferState) {
    const actionType = transferState.hasKey(NGRX_STATE_SK) ? STATE_ACTION_TYPE : ROOT_EFFECTS_INIT;
    actions.pipe(ofType(actionType), first()).subscribe(() => {
      this.initialized$.next(true);
    });
  }

  getTranslation(lang: string) {
    const local$ = defer(() => from(import(`../../../../assets/i18n/${lang}.json`)).pipe(catchError(() => of({}))));
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
