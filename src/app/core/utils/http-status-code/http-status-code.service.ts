import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

@Injectable({ providedIn: 'root' })
export class HttpStatusCodeService {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string,
    @Optional() @Inject(RESPONSE) private response: Response
  ) {}

  setStatus(status: number) {
    if (isPlatformServer(this.platformId)) {
      this.response.status(status);
    }
  }

  setStatusAndRedirect(status: number) {
    this.setStatus(status);
    return this.router.navigateByUrl('/error');
  }
}
