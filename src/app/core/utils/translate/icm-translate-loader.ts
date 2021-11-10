import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { memoize } from 'lodash-es';
import { combineLatest, defer, from, iif, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { LocalizationsService } from 'ish-core/services/localizations/localizations.service';

import { Translations } from './translations.type';

@Injectable()
export class ICMTranslateLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string,
    private localizations: LocalizationsService
  ) {}

  getTranslation = memoize(lang => {
    const SSR_TRANSLATIONS = makeStateKey<Translations>('ssrTranslations-' + lang);

    const local$ = defer(() => from(import(`../../../../assets/i18n/${lang}.json`)).pipe(catchError(() => of({}))));
    const server$ = iif(
      () => isPlatformBrowser(this.platformId) && this.transferState.hasKey(SSR_TRANSLATIONS),
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
