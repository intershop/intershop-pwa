import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { PaymentMethodData } from 'ish-core/models/payment-method/payment-method.interface';

export const paymentMethodInterceptorFactory = (callback: (body: PaymentMethodData) => PaymentMethodData) => {
  return (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.url.includes('/eligible-payment-methods')) {
          return event.clone({ body: callback(event.body) });
        }
        return event;
      })
    );
  };
};
