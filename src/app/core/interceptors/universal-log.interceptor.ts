import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class UniversalLogInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!process.env.LOGGING) {
      return next.handle(req);
    }
    const start = new Date().getTime();
    return next.handle(req).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          // tslint:disable-next-line: no-console
          console.log(
            `${req.method} ${req.urlWithParams} ${res.status} ${JSON.stringify(res.body).length * 2} - ${
              new Date().getTime() - start
            } ms`
          );
        }
      })
    );
  }
}
