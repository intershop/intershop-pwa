import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

export type MultiSiteLocaleMap = Record<string, unknown> | undefined;

@Injectable({ providedIn: 'root' })
export class MultiSiteService {
  constructor(private stateProperties: StatePropertiesService) {}

  /**
   * returns the current url, modified to fit the locale parameter if the environment parameter "multiSiteLocaleMap" is set
   * @param locale the locale which the new url should fit
   * @param location the current location
   * @returns the current url, modified to fit the locale parameter
   */
  getLangUpdatedUrl(locale: string, url: string, baseHref: string): Observable<string> {
    return this.stateProperties
      .getStateOrEnvOrDefault<Record<string, unknown>>('MULTI_SITE_LOCALE_MAP', 'multiSiteLocaleMap')
      .pipe(
        take(1),
        map(multiSiteLocaleMap => {
          let newUrl = url;
          /**
           * only replace lang parameter if:
           * - multiSiteLocaleMap environment var is declared (set to undefined to skip this behaviour)
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
