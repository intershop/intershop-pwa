import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, noop } from 'rxjs';
import { map } from 'rxjs/operators';

import { selectQueryParam } from 'ish-core/store/core/router';
import { logoutUser } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { IdentityProvider } from './identity-provider.interface';

@Injectable({ providedIn: 'root' })
export class ICMIdentityProvider implements IdentityProvider {
  constructor(protected router: Router, protected store: Store, protected apiTokenService: ApiTokenService) {}

  getCapabilities() {
    return {
      editPassword: true,
      editEmail: true,
      editProfile: true,
    };
  }

  init() {
    this.apiTokenService.restore$().subscribe(noop);

    this.apiTokenService.cookieVanishes$.subscribe(type => {
      this.store.dispatch(logoutUser());
      if (type === 'user') {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url, messageKey: 'session_timeout' },
        });
      }
    });
  }

  triggerLogin() {
    return true;
  }

  triggerLogout() {
    this.store.dispatch(logoutUser());
    this.apiTokenService.removeApiToken();
    return this.store.pipe(
      select(selectQueryParam('returnUrl')),
      map(returnUrl => returnUrl || '/home'),
      map(returnUrl => this.router.parseUrl(returnUrl))
    );
  }

  triggerRegister() {
    return true;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.apiTokenService.intercept(req, next);
  }
}
