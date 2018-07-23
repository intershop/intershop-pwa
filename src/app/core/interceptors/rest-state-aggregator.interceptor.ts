// tslint:disable:no-any
import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { REST_ENDPOINT } from '../services/state-transfer/factories';

const REST_CALL_CACHE = makeStateKey<any>('restCallCache');

/**
 * Interceptor aggregates REST calls and their results on the server-side
 * application and puts those into the {@link TransferState} object.
 * On the client-side application these transferred calls are then used
 * to answer the first requests.
 */
@Injectable()
export class RestStateAggregatorInterceptor implements HttpInterceptor {
  private cache: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    @Inject(REST_ENDPOINT) private restEndpoint,
    private transferState: TransferState
  ) {
    this.loadCacheFromState();
  }

  private persistCacheInState() {
    this.transferState.set(REST_CALL_CACHE, this.cache);
  }

  private loadCacheFromState() {
    this.cache = this.transferState.get(REST_CALL_CACHE, {});
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.restEndpoint)) {
      const key = req.urlWithParams;

      if (isPlatformServer(this.platformId)) {
        return next.handle(req).pipe(
          map(event => {
            if (event instanceof HttpResponse) {
              this.cache[key] = JSON.stringify(event.body);
              this.persistCacheInState();
            }
            return event;
          })
        );
      } else if (!!this.cache[key]) {
        const content = JSON.parse(this.cache[key]);
        this.cache[key] = undefined;
        this.persistCacheInState();
        return of(new HttpResponse<any>({ body: content }));
      }
    }
    return next.handle(req);
  }
}
