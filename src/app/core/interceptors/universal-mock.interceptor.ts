// tslint:disable:no-any
import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

/**
 * answers requests to mock-data with file-content in universal mode
 */
@Injectable()
export class UniversalMockInterceptor implements HttpInterceptor {

  constructor( @Inject(PLATFORM_ID) private platformId) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!isPlatformServer(this.platformId)) {
      console.warn('UniversalMockInterceptor is active for non-server platform');
    }
    if (!req.url.startsWith('http')) {
      console.log(`loading mock-data for '${req.url}' from file system.`);
      return Observable.create((observer: Observer<HttpResponse<any>>) => {
        let rootPath = process.cwd();
        if (!!rootPath && rootPath.indexOf('browser') > 0) {
          rootPath = process.cwd().split('browser')[0];
        }
        const file = join(rootPath, 'browser', req.url);
        if (!existsSync(file)) {
          const errString = `mock data file '${file}' not found!`;
          console.error(errString);
          observer.error(errString);
        } else {
          const content = JSON.parse(readFileSync(file, 'utf8'));
          observer.next(new HttpResponse<any>({ body: content }));
          observer.complete();
        }
      });
    } else {
      return next.handle(req);
    }
  }
}
