import { LocationStrategy } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { MULTI_SITE_LOCALE_MAP } from 'ish-core/configurations/injection-keys';

export type MultiSiteLocaleMap = Record<string, unknown> | undefined;

@Injectable({ providedIn: 'root' })
export class MultiSiteService {
  constructor(@Inject(MULTI_SITE_LOCALE_MAP) private multiSiteLocaleMap: MultiSiteLocaleMap) {}

  /**
   * returns the current url, modified to fit the locale parameter if the environment parameter "multiSiteLocaleMap" is set
   * @param locale the locale which the new url should fit
   * @param location the current loation
   * @returns
   */
  getLangUpdatedUrl(locale: string, location: LocationStrategy): string {
    let newUrl = location.path();
    /**
     * only replace lang parameter if:
     * - multiSiteLocaleMap environment var is declared (set to undefined to skip this behaviour)
     * - current baseHref is part of the map (so the empty "/" baseHref would not be replaced)
     * - multiSiteLocaleMap contains target locale
     */
    if (
      this.multiSiteLocaleMap &&
      Object.values(this.multiSiteLocaleMap).includes(location.getBaseHref()) &&
      localeMapHasLangString(locale, this.multiSiteLocaleMap)
    ) {
      newUrl = newUrl.replace(location.getBaseHref(), this.multiSiteLocaleMap[locale]);
    }
    return newUrl;
  }
}

function localeMapHasLangString(
  lang: string,
  multiSiteLocaleMap: MultiSiteLocaleMap
): multiSiteLocaleMap is Record<string, string> {
  return lang && multiSiteLocaleMap[lang] && typeof multiSiteLocaleMap[lang] === 'string';
}
