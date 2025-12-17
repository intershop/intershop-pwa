import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, Observer } from 'rxjs';

import { logECS } from 'ish-core/utils/ssr-logging.utils';

/**
 * answers requests to mock-data with file-content in SSR mode
 */
@Injectable()
export class SSRMockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!SSR) {
      logECS('error', 'SSRMockInterceptor is active for non-server platform', 'ssr-mock.interceptor');
    }
    if (!req.url.startsWith('http')) {
      logECS('info', `loading mock-data for '${req.url}' from file system.`, 'ssr-mock.interceptor', {
        url: { original: req.url },
      });
      return new Observable((observer: Observer<HttpResponse<unknown>>) => {
        let rootPath = SSR ? process.cwd() : '';
        if (rootPath && rootPath.indexOf('browser') > 0) {
          rootPath = SSR ? process.cwd().split('browser')[0] : '';
        }
        const file = join(rootPath, 'browser', req.url);
        if (!existsSync(file)) {
          const errString = `mock data file '${file}' not found!`;
          logECS('error', errString, 'ssr-mock.interceptor', {
            file: { path: file },
          });
          observer.error(errString);
        } else {
          const content = JSON.parse(readFileSync(file, 'utf8'));
          observer.next(new HttpResponse<unknown>({ body: content }));
          observer.complete();
        }
      });
    } else {
      return next.handle(req);
    }
  }
}
