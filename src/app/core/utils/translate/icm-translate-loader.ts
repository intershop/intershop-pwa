import { Inject, Injectable, InjectionToken, TransferState, makeStateKey } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { TranslateLoader } from '@ngx-translate/core';
import { memoize } from 'lodash-es';
import { Subject, combineLatest, defer, from, iif, of } from 'rxjs';
import { catchError, filter, first, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';
import { InjectSingle } from 'ish-core/utils/injection';

import { Translations } from './translations.type';

interface LocalTranslations {
  // return a promise with desired local translations based on given lang
  useFactory(lang: string): Promise<object>;
}

export const LOCAL_TRANSLATIONS = new InjectionToken<LocalTranslations>('translations');

@Injectable()
export class ICMTranslateLoader implements TranslateLoader {
  newLanguage$ = new Subject<string>();

  constructor(
    private actions$: Actions,
    private transferState: TransferState,
    private localizations: LocalizationsService,
    @Inject(LOCAL_TRANSLATIONS) private localTranslations: InjectSingle<typeof LOCAL_TRANSLATIONS>
  ) {}

  getTranslation = memoize(lang => {
    this.newLanguage$.next(lang);
    const SSR_TRANSLATIONS = makeStateKey<Translations>(`ssrTranslations-${lang}`);

    const local$ = defer(() => from(this.localTranslations.useFactory(lang)).pipe(catchError(() => of({}))));

    const server$ = iif(
      () => !SSR && this.transferState.hasKey(SSR_TRANSLATIONS),
      of(this.transferState.get(SSR_TRANSLATIONS, {})),
      // the localization call should wait until all server supplied configuration parameter are applied to the state
      this.actions$.pipe(
        ofType(routerNavigationAction),
        first(),
        switchMap(() =>
          this.localizations.getServerTranslations(lang).pipe(
            tap(data => {
              this.transferState.set(SSR_TRANSLATIONS, data);
            })
          )
        ),
        // close current localization call when a new language is requested
        takeUntil(this.newLanguage$.pipe(filter(newLang => newLang !== lang)))
      )
    );
    return combineLatest([local$, server$]).pipe(
      map(([localTranslations, serverTranslations]) => ({
        ...localTranslations,
        ...serverTranslations,
      })),
      shareReplay(1)
    );
  });
}
