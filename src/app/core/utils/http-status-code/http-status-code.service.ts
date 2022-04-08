import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

@Injectable({ providedIn: 'root' })
export class HttpStatusCodeService {
  constructor(private router: Router, @Optional() @Inject(RESPONSE) private response: Response) {}

  /**
   * set status for SSR response
   *
   * redirecting to error / not-found page must be disabled for guards, where the routing is organized differently
   *
   * @returns the Promise from the Angular Router or a Promise resolving to true if no routing was necessary or it was disabled
   */
  setStatus(status: number, redirect = true) {
    if (SSR) {
      this.response.status(status);
    }
    if (redirect && status >= 400) {
      // 503: server is unavailable
      const route = status === 503 ? '/maintenance' : '/error';

      if (SSR) {
        return this.router.navigateByUrl(route);
      } else {
        return this.router.navigateByUrl(route, { skipLocationChange: status < 500 });
      }
    }
    return Promise.resolve(true);
  }
}
