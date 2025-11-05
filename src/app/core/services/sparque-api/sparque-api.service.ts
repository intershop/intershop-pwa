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
  map,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AvailableOptions } from 'ish-core/services/api/api.service';
import { getCurrentLocale, getSparqueConfig } from 'ish-core/store/core/configuration';
import { communicationTimeoutError, serverError } from 'ish-core/store/core/error';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

// sparque config keys that should not be appended to the query params
const SPARQUE_CONFIG_EXCLUDE_PARAMS = ['serverUrl', 'features'];

/**
 * The Sparque API Service handles interaction with the SPARQUE.AI recommendation engine.
 * It provides methods to make HTTP requests to SPARQUE endpoints with proper authentication,
 * parameter mapping, and error handling.
 *
 * This service automatically handles:
 * - Authentication via bearer tokens
 * - User identification (customer number or business partner number)
 * - Locale configuration
 * - SPARQUE-specific configuration parameters
 * - Error handling and retry logic
 */
@Injectable({ providedIn: 'root' })
export class SparqueApiService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private apiTokenService: ApiTokenService,
    private accountFacade: AccountFacade
  ) {}

  /**
   * Constructs HTTP client parameters for SPARQUE API requests.
   * Combines URL construction and header/parameter preparation.
   *
   * @param path        The API endpoint path (relative or absolute URL)
   * @param apiVersion  The SPARQUE API version to use (e.g., 'v2')
   * @param options     Optional HTTP request configuration
   * @returns           Observable containing the complete URL and HTTP options
   */
  private constructHttpClientParams(
    path: string,
    apiVersion: string,
    options?: AvailableOptions
  ): Observable<[string, { headers: HttpHeaders; params: HttpParams }]> {
    return forkJoin([
      this.constructUrlForPath(path, apiVersion),
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
   * Converts SPARQUE configuration and request parameters to HTTP query parameters.
   * Automatically includes:
   * - SPARQUE configuration values (apiName, workspaceName, channelId, etc.)
   * - Current locale (formatted for SPARQUE compatibility)
   * - User identification (customer number or business partner number)
   * - Additional request parameters
   *
   * @param path    The API endpoint path
   * @param params  Additional HTTP parameters to include
   * @returns       Combined HTTP parameters for the request
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
        concatLatestFrom(() => [
          this.store.pipe(select(getCurrentLocale)),
          this.accountFacade.user$,
          this.accountFacade.customer$,
        ])
      )
      .subscribe(([config, locale, user, customer]) => {
        Object.keys(config).forEach(key => {
          if (!SPARQUE_CONFIG_EXCLUDE_PARAMS.includes(key)) {
            sparqueParams = sparqueParams.append(key, <string>config[key]);
          }
        });
        sparqueParams = sparqueParams.append('Locale', locale.replace('_', '-'));

        if (customer && user) {
          sparqueParams = sparqueParams.append(
            'user',
            customer?.isBusinessCustomer ? user?.businessPartnerNo : customer?.customerNo
          );
        }
      });

    params?.keys().forEach(key => {
      if (key.includes('selectedFacets') || key.includes('cartProductIds')) {
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
   * Constructs HTTP headers for SPARQUE API requests.
   * Sets default headers and optionally adds bearer token authentication.
   *
   * @param options  Optional HTTP request configuration including custom headers
   * @returns        Observable containing the complete HTTP headers
   */
  private constructHeaders(options?: AvailableOptions): Observable<HttpHeaders> {
    let defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

    return this.apiTokenService.apiToken$.pipe(
      first(),
      switchMap(apiToken => {
        if (apiToken) {
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

  /**
   * Constructs the complete URL for a SPARQUE API endpoint.
   * Handles both relative paths (using SPARQUE server configuration) and absolute URLs.
   *
   * @param path        The API endpoint path
   * @param apiVersion  The SPARQUE API version to use
   * @returns           Observable containing the complete URL
   */
  private constructUrlForPath(path: string, apiVersion: string): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }
    return combineLatest([
      this.store.pipe(
        select(getSparqueConfig),
        whenTruthy(),
        map(config => config.serverUrl.concat('/api/', apiVersion))
      ),
      of(`/${path}`),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }

  /**
   * Handles HTTP errors from SPARQUE API requests.
   * Dispatches appropriate error actions for communication timeouts and server errors.
   *
   * @param dispatch  Whether to dispatch error actions to the store
   * @returns         RxJS operator for error handling
   */
  private handleErrors<T>(dispatch: boolean): MonoTypeOperatorFunction<T> {
    return catchError(error => {
      if (dispatch) {
        if (error.status === 0) {
          this.store.dispatch(communicationTimeoutError({ error }));
          return EMPTY;
        } else if (error.status >= 500 && error.status < 600) {
          this.store.dispatch(serverError({ error }));
          return EMPTY;
        }
      }
      return throwError(() => error);
    });
  }

  /**
   * Executes HTTP requests with error handling.
   *
   * @param options    HTTP request options including error handling configuration
   * @param httpCall$  The HTTP request observable to execute
   * @returns          The HTTP response with error handling applied
   */
  private execute<T>(options: AvailableOptions, httpCall$: Observable<T>): Observable<T> {
    return httpCall$.pipe(this.handleErrors(!options?.skipApiErrorHandling));
  }

  /**
   * Performs an HTTP GET request to a SPARQUE API endpoint.
   * Automatically handles authentication, parameter mapping, and error handling.
   *
   * @param path        The API endpoint path (relative or absolute URL)
   * @param apiVersion  The SPARQUE API version to use (e.g., 'v2')
   * @param options     Optional HTTP request configuration
   * @returns           Observable containing the API response
   */
  get<T>(path: string, apiVersion: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, apiVersion, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.get<T>(url, httpOptions))
      )
    );
  }
}
