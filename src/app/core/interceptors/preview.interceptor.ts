import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PreviewService } from 'ish-core/services/preview/preview.service';

/**
 * add PreviewContextID to every request if it is available in the SessionStorage
 */
@Injectable()
export class PreviewInterceptor implements HttpInterceptor {
  constructor(private previewService: PreviewService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.previewService.previewContextId) {
      return next.handle(
        req.clone({
          url: `${req.url};prectx=${this.previewService.previewContextId}`,
        })
      );
    }

    return next.handle(req);
  }
}
