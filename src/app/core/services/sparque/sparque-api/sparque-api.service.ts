import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, defer, forkJoin, iif, of } from 'rxjs';
import { auditTime, concatMap, first, map, switchMap, take, tap } from 'rxjs/operators';

import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { AvailableOptions } from 'ish-core/services/api/api.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export const DEFINED_FACETS = ['category', 'brand'];

@Injectable({ providedIn: 'root' })
export class SparqueApiService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private apiTokenService: ApiTokenService,
    private statePropertiesService: StatePropertiesService,
    private tokenService: TokenService
  ) {}

  static getSearchPath(searchTerm: string, locale: string, userId: string, basketSKUs: string[]): string {
    const basketSKUsPath = basketSKUs?.length
      ? `p/cartId/${basketSKUs.reduce((prev, curr, idx) => `${prev}${idx ? '|' : ''}1(${curr})`, '') ?? '1()'}`
      : '';
    return `${userId ? `c/userId/${userId}/` : ''}c/locale/${locale ?? 'en-US'}/e/search/p/keyword/${encodeURIComponent(
      searchTerm
    )}/${basketSKUsPath}`;
  }

  static getAppliedFilterPath(searchParameter: URLFormParams): string {
    return Object.keys(searchParameter)
      .filter(key => key !== 'searchTerm' && key !== 'SearchParameter')
      .map(key =>
        DEFINED_FACETS.includes(key)
          ? `e/${encodeURIComponent(key)}:FILTER/p/value/1(${encodeURIComponent(searchParameter[key][0])})`
          : `e/facet_filter/p/attribute/${key}/p/value/1(${encodeURI(searchParameter[key][0])})`
      )
      .reduce((prev, curr, idx, arr) => prev.concat(curr, idx !== arr.length - 1 ? '/' : ''), '');
  }

  /**
   * merges supplied and default headers
   */
  private constructHeaders(options?: AvailableOptions): Observable<HttpHeaders> {
    return this.apiTokenService.apiToken$.pipe(
      first(),
      switchMap(apiToken =>
        iif(() => !!apiToken, of(apiToken), this.tokenService.fetchToken('anonymous')).pipe(
          whenTruthy(),
          first(),
          switchMap(apiToken => {
            const defaultHeader = new HttpHeaders().set('Authorization', `bearer ${apiToken}`);

            return of(
              options?.headers
                ? // append incoming headers to default ones
                  options.headers.keys().reduce((acc, key) => acc.set(key, options.headers.get(key)), defaultHeader)
                : // just use default headers
                  defaultHeader
            );
          })
        )
      )
    );
  }

  private constructUrlForPath(path: string): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }

    return combineLatest([
      this.statePropertiesService.getStateOrEnvOrDefault<SparqueConfig>('SPARQUE', 'sparque').pipe(
        whenTruthy(),
        map(config => config.endPoint)
      ),
      of(`/${path}`),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }

  private constructHttpClientParams(
    path: string,
    options?: AvailableOptions
  ): Observable<[string, { headers: HttpHeaders; params: HttpParams }]> {
    return forkJoin([
      this.constructUrlForPath(path),
      defer(() =>
        this.constructHeaders(options).pipe(
          map(headers => ({
            headers,
            params: options?.params,
            responseType: options?.responseType,
          }))
        )
      ),
    ]);
  }

  /**
   * http get request
   */
  get<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.constructHttpClientParams(path.replace('//', '/'), options).pipe(
      concatMap(([url, httpOptions]) => this.httpClient.get<T>(url, httpOptions))
    );
  }

  getRelevantInformation$(delay = true): Observable<[string[], string, string]> {
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
