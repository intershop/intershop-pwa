import { Inject, Injectable, InjectionToken } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { memoize } from 'lodash-es';
import { combineLatest, defer, from, iif, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

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
  constructor(
    private transferState: TransferState,
    private localizations: LocalizationsService,
    @Inject(LOCAL_TRANSLATIONS) private localTranslations: InjectSingle<typeof LOCAL_TRANSLATIONS>
  ) {}

  getTranslation = memoize(lang => {
    const SSR_TRANSLATIONS = makeStateKey<Translations>(`ssrTranslations-${lang}`);

    const local$ = defer(() => from(this.localTranslations.useFactory(lang)).pipe(catchError(() => of({}))));

    const server$ = iif(
      () => !SSR && this.transferState.hasKey(SSR_TRANSLATIONS),
      of(this.transferState.get(SSR_TRANSLATIONS, {})),
      this.localizations.getServerTranslations(lang).pipe(
        tap(data => {
          this.transferState.set(SSR_TRANSLATIONS, data);
        })
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
