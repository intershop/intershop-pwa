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
   * Intercepts requests and replaces mock paths with file references.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.apiMockPaths?.length || !this.urlHasToBeMocked(req.url)) {
      return next.handle(req);
    }

    const newUrl = `${MOCK_DATA_ROOT}/${this.getRestPath(req.url)}/${req.method.toLocaleLowerCase()}.json`;

    // tslint:disable-next-line:no-console
    console.log(`redirecting '${req.url}' to '${newUrl}'`);

    return next.handle(req.clone({ url: newUrl, method: 'GET' }));
  }

  private urlHasToBeMocked(url: string): boolean {
    if (url.startsWith(this.restEndpoint)) {
      const path = this.getRestPath(url);
      return this.matchPath(path, this.apiMockPaths);
    }
    return false;
  }

  private getRestPath(url: string): string {
    const withoutApplication = url.substring(this.restEndpoint.length);
    return withoutApplication.substring(withoutApplication.indexOf('/') + 1).split('?')[0];
  }

  matchPath(requestedPath: string, pathArray: string[] = []) {
    return pathArray.reduce((acc, val) => acc || new RegExp(val).test(requestedPath), false);
  }
}
