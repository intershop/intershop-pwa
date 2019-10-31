import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

@Injectable({ providedIn: 'root' })
export class HttpStatusCodeService {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(RESPONSE) private response: any
  ) {}

  setStatus(status: number) {
    if (isPlatformServer(this.platformId)) {
      this.response.status(status);
    }
  }

  setStatusAndRedirect(status: number) {
    this.setStatus(status);
    this.router.navigateByUrl('/error');
  }
}
