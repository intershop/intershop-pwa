import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from './../../environments/environment';

@Injectable()
export class UniversalMockInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!isPlatformServer(environment.platformId)) {
      console.warn('UniversalMockInterceptor is active for non-server platform');
    }
    if (!req.url.startsWith('http')) {
      console.log(`loading mock-data for '${req.url}' from file system.`);
      return Observable.create((observer: Observer<HttpResponse<any>>) => {
        const file = join(process.cwd(), 'browser', req.url);
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
