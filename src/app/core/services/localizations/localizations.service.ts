import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';

import { getRestEndpoint } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';
import { Translations } from 'ish-core/utils/translate/translations.type';

function filterAndTransformKeys(translations: Record<string, string>): Translations {
  // this implementation is mutable by intention, as it can lead to performance issues when using Object.entries and reduce
  const filtered: Record<string, string> = {};
  for (const key in translations) {
    if (key.startsWith('pwa-')) {
      filtered[key.substring(4)] = translations[key];
    }
  }
  return filtered;
}

@Injectable({ providedIn: 'root' })
export class LocalizationsService {
  private icmEndpoint$: Observable<string>;

  constructor(private httpClient: HttpClient, private errorHandler: ErrorHandler, store: Store) {
    this.icmEndpoint$ = store.pipe(select(getRestEndpoint), whenTruthy(), take(1));
  }

  getServerTranslations(lang: string) {
    return this.icmEndpoint$.pipe(
      concatMap(url =>
        this.httpClient
          .get(`${url};loc=${lang}/localizations`, {
            params: {
              searchKeys: 'pwa-',
            },
          })
          .pipe(
            map(filterAndTransformKeys),
            catchError(err => {
              this.errorHandler.handleError(err);
              return of({});
            })
          )
      )
    );
  }

  getSpecificTranslation(lang: string, key: string) {
    return this.icmEndpoint$.pipe(
      concatMap(url => this.httpClient.get(`${url};loc=${lang}/localizations/${key}`, { responseType: 'text' })),
      catchError(() => of(''))
    );
  }
}
