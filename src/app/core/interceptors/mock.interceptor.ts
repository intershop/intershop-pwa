import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { API_MOCK_PATHS } from 'ish-core/configurations/injection-keys';
import { getRestEndpoint } from 'ish-core/store/core/configuration';

const MOCK_DATA_ROOT = './assets/mock-data';

/**
 * redirects a given request to the REST API to mocked data depending on mock settings
 */
@Injectable()
export class MockInterceptor implements HttpInterceptor {
  private restEndpoint: string;

  constructor(@Inject(API_MOCK_PATHS) private apiMockPaths: string[], store: Store) {
    store.pipe(select(getRestEndpoint)).subscribe(data => (this.restEndpoint = data));
  }

  /**
   * Intercepts out going request and changes url to mock url if needed.
   * Intercepts incoming response and sets authentication-token header if login was requested.
   * Also handles logging in patricia with correct password and failing if credentials are wrong
   * @param  {HttpRequest<unknown>} req
   * @param  {HttpHandler} next
   * @returns  Observable<HttpEvent<unknown>>
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.requestHasToBeMocked(req)) {
      return next.handle(req);
    }
    const newUrl = this.getMockUrl(req);
    // tslint:disable-next-line:no-console
    console.log(`redirecting '${req.url}' to '${newUrl}'`);

    return next.handle(req.clone({ url: newUrl, method: 'GET' }));
  }

  /**
   * transforms server REST URL to mock REST URL
   */
  getMockUrl(req: HttpRequest<unknown>) {
    return this.urlHasToBeMocked(req.url)
      ? `${MOCK_DATA_ROOT}/${this.getRestPath(
          this.removeQueryStringParameter(req.url)
        )}/${req.method.toLocaleLowerCase()}.json`
      : req.url;
  }

  private urlHasToBeMocked(url: string): boolean {
    if (url.startsWith(this.restEndpoint)) {
      const path = this.getRestPath(url);
      return this.matchPath(path, this.apiMockPaths);
    }
    return false;
  }

  /**
   * check if HttpRequest has to be mocked
   */
  requestHasToBeMocked(req: HttpRequest<unknown>): boolean {
    return this.urlHasToBeMocked(req.url);
  }

  getRestPath(url: string): string {
    const withoutApplication = url.substring(this.restEndpoint.length);
    return withoutApplication.substring(withoutApplication.indexOf('/') + 1);
  }

  private removeQueryStringParameter(path: string): string {
    return path.split('?')[0];
  }

  matchPath(requestedPath: string, pathArray: string[]) {
    for (const configPath of pathArray || []) {
      if (new RegExp(`^${configPath}$`).test(requestedPath)) {
        return true;
      }
    }
    return false;
  }
}
