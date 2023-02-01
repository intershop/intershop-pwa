import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { Observable, auditTime, combineLatest, map, take, tap } from 'rxjs';

import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { log } from 'ish-core/utils/dev/operators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { environment } from '../../../../../environments/environment';
import { getSparqueConfigEndpoint } from '../../store/sparque-config';
import { getSparqueState } from '../../store/sparque-store';

export const DEFINED_FACETS = ['category', 'brand'];

@Injectable({ providedIn: 'root' })
export class SparqueApiService {
  constructor(private httpClient: HttpClient, private store: Store) {}

  static getSearchPath(searchTerm: string, locale: string, userId: string, basketSKUs: string[]): string {
    const basketSKUsPath = basketSKUs?.length
      ? `p/cartId/${basketSKUs.reduce((prev, curr, idx) => `${prev}${idx ? '|' : ''}1(${curr})`, '') ?? '1()'}`
      : '';
    return `c/locale/${locale ?? 'en-US'}/e/search${userId ? `/p/userId/${userId}` : ''}/p/keyword/${encodeURIComponent(
      searchTerm
    )}/${basketSKUsPath}`;
  }

  static getAppliedFilterPath(searchParameter: URLFormParams): string {
    return Object.keys(searchParameter)
      .filter(key => key !== 'searchTerm')
      .map(key =>
        DEFINED_FACETS.includes(key)
          ? `e/${encodeURIComponent(key)}:FILTER/p/value/1(${encodeURIComponent(searchParameter[key][0])})`
          : `e/facet_filter/p/attribute/${key}/p/value/1(${encodeURI(searchParameter[key][0])})`
      )
      .reduce((prev, curr, idx, arr) => prev.concat(curr, idx !== arr.length - 1 ? '/' : ''), '/');
  }
  /**
   * http get request
   */
  get<T>(path: string): Observable<T> {
    // literally the worst hack you will ever see
    console.log(getSparqueState);
    //const getSparqueConfig = createSelector(getSparqueState, state => state?.sparqueConfig);
    const getSparqueConfig2 = createSelector(getSparqueState, state => state?.sparqueConfig);
    console.log(this.store.pipe(select(getSparqueConfigEndpoint)));
    this.store.pipe(select(getSparqueConfigEndpoint)).subscribe(data => console.log(data));
    this.store.pipe(select(getSparqueConfigEndpoint), log('testdori')).subscribe();
    return this.httpClient.get<T>(`${environment.sparqueBaseURL}/${path.replace('//', '/')}`);
  }

  getRelevantInformations$(delay = true): Observable<[string[], string, string]> {
    return combineLatest([
      this.store.pipe(
        select(getCurrentBasket),
        map(basket => basket?.lineItems?.map(lineItem => lineItem?.productSKU))
      ),
      this.store.pipe(
        select(getLoggedInUser),
        map(user => user?.businessPartnerNo)
      ),
      this.store.pipe(
        select(getCurrentLocale),
        map(locale => locale?.replace('_', '-'))
      ),
    ]).pipe(delay ? auditTime(500) : tap(), take(1));
  }
}
