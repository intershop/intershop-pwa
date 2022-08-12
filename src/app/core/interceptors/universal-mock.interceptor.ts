import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, Observer } from 'rxjs';

/**
 * answers requests to mock-data with file-content in universal mode
 */
@Injectable()
export class UniversalMockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!SSR) {
      console.warn('UniversalMockInterceptor is active for non-server platform');
    }
    if (!req.url.startsWith('http')) {
      // eslint-disable-next-line no-console
      console.log(`loading mock-data for '${req.url}' from file system.`);
      return new Observable((observer: Observer<HttpResponse<unknown>>) => {
        let rootPath = process.cwd();
        if (rootPath && rootPath.indexOf('browser') > 0) {
          rootPath = process.cwd().split('browser')[0];
        }
        const file = join(rootPath, 'browser', req.url);
        if (!existsSync(file)) {
          const errString = `mock data file '${file}' not found!`;
          console.error(errString);
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
