import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { getRestEndpoint } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';
import { Translations } from 'ish-core/utils/translate/translations.type';

function maybeJSON(val: string) {
  if (val.startsWith('{')) {
    try {
      return JSON.parse(val);
    } catch {
      // default
    }
  }
  return val;
}

function filterAndTransformKeys(translations: Record<string, string>): Translations {
  return Object.entries(translations)
    .filter(([key]) => key.startsWith('pwa-'))
    .map(([key, value]) => [key.substring(4), maybeJSON(value)])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

@Injectable({ providedIn: 'root' })
export class LocalizationsService {
  constructor(private httpClient: HttpClient, private store: Store) {}

  getServerTranslations(lang: string) {
    return this.store.pipe(select(getRestEndpoint), whenTruthy()).pipe(
      switchMap(url =>
        this.httpClient
          .get(`${url};loc=${lang}/localizations`, {
            params: {
              searchKeys: 'pwa-',
            },
          })
          .pipe(map(filterAndTransformKeys))
      )
    );
  }
}
