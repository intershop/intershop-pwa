import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, combineLatest, defer, first, forkJoin, iif, map, of, switchMap, take, tap } from 'rxjs';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { getCurrentLocale, getSparqueConfig } from 'ish-core/store/core/configuration';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

// sparque config keys that should not be appended to the query params
const SPARQUE_CONFIG_EXCLUDE_PARAMS = ['server_url', 'wrapperAPI'];

/**
 * Service to interact with the Sparque API.
 *
 * This service extends the `ApiService` and provides methods to construct HTTP client parameters,
 * headers, and URLs for making API requests to the Sparque backend.
 *
 * @extends ApiService
 *
 * @constructor
 * @param httpClient - The HTTP client used to make requests.
 * @param store - The store used to select state.
 * @param featureToggleService - The service used to manage feature toggles.
 * @param apiTokenService - The service used to manage API tokens.
 * @param tokenService - The service used to fetch tokens.
 */
@Injectable({ providedIn: 'root' })
export class SparqueApiService extends ApiService {
  private static SPARQUE_PERSONALIZATION_IDENTIFIER = 'userId';

  constructor(
    protected httpClient: HttpClient,
    protected store: Store,
    protected featureToggleService: FeatureToggleService,
    private apiTokenService: ApiTokenService,
    private tokenService: TokenService
  ) {
    super(httpClient, store, featureToggleService);
  }

  protected constructHttpClientParams(
    path: string,
    options?: AvailableOptions
  ): Observable<[string, { headers: HttpHeaders; params: HttpParams }]> {
    return forkJoin([
      this.constructUrlForPath(path),
      defer(() =>
        this.constructHeaders(options).pipe(
          map(headers => ({
            headers,
            params: options?.params
              ? // append incoming params to default ones
                options.params
                  .keys()
                  .reduce((acc, key) => acc.set(key, options.params.get(key)), this.sparqueQueryToHttpParams(path))
              : // just use default headers
                this.sparqueQueryToHttpParams(path),
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
  private sparqueQueryToHttpParams(path: string): HttpParams {
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
  protected constructHeaders(options?: AvailableOptions): Observable<HttpHeaders> {
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

  constructUrlForPath(path: string): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }
    return combineLatest([
      this.store.pipe(
        select(getSparqueConfig),
        whenTruthy(),
        tap(config => console.log('config', config)),
        map(config => config.server_url.concat('/api/', config.wrapperAPI))
      ),
      of(`/${path}`),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }
}
