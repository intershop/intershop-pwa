import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  EMPTY,
  MonoTypeOperatorFunction,
  Observable,
  catchError,
  combineLatest,
  concatMap,
  defer,
  first,
  forkJoin,
  iif,
  map,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AvailableOptions } from 'ish-core/services/api/api.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { getCurrentLocale, getSparqueConfig } from 'ish-core/store/core/configuration';
import { sparqueSearchServerError, sparqueSuggestServerError } from 'ish-core/store/shopping/search';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

// sparque config keys that should not be appended to the query params
const SPARQUE_CONFIG_EXCLUDE_PARAMS = ['serverUrl', 'wrapperApi', 'enablePrices'];

/**
 * Service for interacting with the Sparque API.
 *
 * This service provides methods to construct HTTP requests with appropriate headers and parameters,
 * handle errors, and execute HTTP GET requests. It leverages Angular's HttpClient for making HTTP calls
 * and NgRx Store for accessing application state.
 *
 * The service includes methods to:
 * - Construct HTTP client parameters and headers.
 * - Convert paths to HTTP parameters based on Sparque configuration and locale.
 * - Handle errors and dispatch actions to the store in case of server errors.
 * - Execute HTTP GET requests.
 */
@Injectable({ providedIn: 'root' })
export class SparqueApiService {
  private static SPARQUE_PERSONALIZATION_IDENTIFIER = 'userId';

  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private apiTokenService: ApiTokenService,
    private tokenService: TokenService
  ) {}

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
            params: this.sparqueQueryToHttpParams(path, options?.params),
            responseType: options?.responseType,
          }))
        )
      ),
    ]);
  }

  /**
   * Converts a given path to HTTP parameters based on the Sparque configuration and current locale.
   * If the path starts with 'http://' or 'https://', it returns an empty set of HTTP parameters.
   * Otherwise, it retrieves the Sparque configuration and current locale from the store,
   * and appends them as HTTP parameters, excluding specific keys defined in SPARQUE_CONFIG_EXCLUDE_PARAMS.
   *
   * @param path - The path to be converted to HTTP parameters.
   * @returns An instance of HttpParams containing the Sparque configuration and locale.
   */
  private sparqueQueryToHttpParams(path: string, params: HttpParams): HttpParams {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return new HttpParams();
    }
    let sparqueParams = new HttpParams();

    this.store
      .pipe(
        select(getSparqueConfig),
        take(1),
        concatLatestFrom(() => this.store.pipe(select(getCurrentLocale)))
      )
      .subscribe(([config, locale]) => {
        Object.keys(config).forEach(key => {
          if (!SPARQUE_CONFIG_EXCLUDE_PARAMS.includes(key)) {
            sparqueParams = sparqueParams.append(key, String(config[key]));
          }
        });
        sparqueParams = sparqueParams.append('Locale', locale.replace('_', '-'));
      });
    params?.keys().forEach(key => {
      if (key.includes('selectedFacets')) {
        params
          .get(key)
          ?.split(',')
          .forEach(value => {
            sparqueParams = sparqueParams.append(key, value);
          });
      } else {
        sparqueParams = sparqueParams.append(key, params.get(key));
      }
    });

    return sparqueParams;
  }

  /**
   * Constructs HTTP headers for a request, optionally including an authorization token.
   *
   * @param options - Optional parameters that may include additional headers and query parameters.
   * @returns An observable that emits the constructed HttpHeaders.
   *
   * This method performs the following steps:
   * 1. Initializes default headers with 'content-type' and 'Accept' set to 'application/json'.
   * 2. Checks if the `SPARQUE_PERSONALIZATION_IDENTIFIER` is present in the query parameters.
   * 3. If the identifier is present, it attempts to retrieve an API token:
   *    - If an API token is available, it uses it.
   *    - If no API token is available, it fetches an anonymous token.
   * 4. Appends the authorization token to the headers if available.
   * 5. Merges any additional headers provided in the options with the default headers.
   */
  private constructHeaders(options?: AvailableOptions): Observable<HttpHeaders> {
    let defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

    return iif(
      () => options?.params?.keys().includes(SparqueApiService.SPARQUE_PERSONALIZATION_IDENTIFIER),
      this.apiTokenService.apiToken$.pipe(
        first(),
        switchMap(apiToken =>
          iif(
            () => options?.params?.keys().includes(SparqueApiService.SPARQUE_PERSONALIZATION_IDENTIFIER) && !!apiToken,
            of(apiToken),
            this.tokenService.fetchToken('anonymous')
          )
        )
      ),
      of(EMPTY)
    ).pipe(
      first(),
      switchMap(apiToken => {
        if (apiToken && apiToken !== EMPTY) {
          defaultHeaders = defaultHeaders.append('Authorization', `bearer ${apiToken}`);
        }
        return of(
          options?.headers
            ? // append incoming headers to default ones
              options.headers.keys().reduce((acc, key) => acc.set(key, options.headers.get(key)), defaultHeaders)
            : // just use default headers
              defaultHeaders
        );
      })
    );
  }

  private constructUrlForPath(path: string): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }
    return combineLatest([
      this.store.pipe(
        select(getSparqueConfig),
        whenTruthy(),
        map(config => config.serverUrl.concat('/api/', config.wrapperApi))
      ),
      of(`/${path}`),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }

  private handleErrors<T>(dispatch: boolean): MonoTypeOperatorFunction<T> {
    return catchError(error => {
      if (dispatch && (error.status === 0 || (error.status >= 500 && error.status < 600))) {
        const errorLocalizationKey = 'sparque.server.error.text';
        if (error.message.includes('/search')) {
          error.message = errorLocalizationKey;
          this.store.dispatch(sparqueSearchServerError(error));
        }
        if (error.message.includes('/suggestions')) {
          error.message = errorLocalizationKey;
          this.store.dispatch(sparqueSuggestServerError(error));
        }
      }
      return throwError(() => error);
    });
  }

  private execute<T>(httpCall$: Observable<T>): Observable<T> {
    return httpCall$.pipe(this.handleErrors(true));
  }

  /**
   * http get request
   */
  get<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.get<T>(url, httpOptions))
      )
    );
  }
}
