import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';

import { getRestEndpoint } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';
import { Translations } from 'ish-core/utils/translate/translations.type';

function filterAndTransformKeys(translations: Record<string, string>, prefix = 'pwa-'): Translations {
  // this implementation is mutable by intention, as it can lead to performance issues when using Object.entries and reduce
  const filtered: Record<string, string> = {};
  for (const key in translations) {
    if (key.startsWith(prefix)) {
      filtered[key.substring(prefix.length)] = translations[key];
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

  /**
   * Retrieves server-side translations for a specified language and key prefix.
   *
   * @param lang - The language code for which translations are requested.
   * @param prefix - The prefix used to filter translation keys. Defaults to 'pwa-'.
   * @returns An Observable emitting a record of filtered and transformed translation key-value pairs.
   */
  getServerTranslations(lang: string, prefix = 'pwa-') {
    return this.icmEndpoint$.pipe(
      concatMap(url =>
        this.httpClient
          .get<Record<string, string>>(`${url};loc=${lang}/localizations`, {
            params: {
              searchKeys: prefix,
            },
          })
          .pipe(
            map(translations => filterAndTransformKeys(translations, prefix)),
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
