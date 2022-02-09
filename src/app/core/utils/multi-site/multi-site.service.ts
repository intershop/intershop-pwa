import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { getMultiSiteLocaleMap } from 'ish-core/store/core/configuration';

export type MultiSiteLocaleMap = Record<string, unknown> | undefined;

@Injectable({ providedIn: 'root' })
export class MultiSiteService {
  constructor(private store: Store) {}

  /**
   * returns the current url, modified to fit the locale parameter if the environment parameter "multiSiteLocaleMap" is set
   *
   * @param locale the locale which the new url should fit
   * @param url the current url
   * @param baseHref the current baseHref which needs to be replaced
   * @returns the modified url
   */
  getLangUpdatedUrl(locale: string, url: string, baseHref: string): Observable<string> {
    return this.store.pipe(
      select(getMultiSiteLocaleMap),
      take(1),
      map(multiSiteLocaleMap => {
        let newUrl = url;
        /**
         * only replace lang parameter if:
         * - multiSiteLocaleMap environment var is declared (set to undefined to skip this behavior)
         * - current baseHref is part of the map (so the empty "/" baseHref would not be replaced)
         * - multiSiteLocaleMap contains target locale
         */
        if (
          multiSiteLocaleMap &&
          Object.values(multiSiteLocaleMap).includes(baseHref) &&
          localeMapHasLangString(locale, multiSiteLocaleMap)
        ) {
          newUrl = newUrl.replace(baseHref, multiSiteLocaleMap[locale]);
        }
        return newUrl;
      })
    );
  }
}

function localeMapHasLangString(
  lang: string,
  multiSiteLocaleMap: MultiSiteLocaleMap
): multiSiteLocaleMap is Record<string, string> {
  return lang && multiSiteLocaleMap[lang] && typeof multiSiteLocaleMap[lang] === 'string';
}
