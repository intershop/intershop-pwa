import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';

@Injectable({ providedIn: 'root' })
export class ErrorStatusGuard implements CanActivate {
  constructor(private appFacade: AppFacade, private router: Router) {}
  canActivate() {
    return this.appFacade.generalError$.pipe(map(error => (!error ? this.router.parseUrl('/home') : true)));
  }
}
