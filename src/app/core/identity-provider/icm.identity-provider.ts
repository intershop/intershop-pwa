import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, noop } from 'rxjs';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { IdentityProvider, TriggerReturnType } from './identity-provider.interface';

@Injectable({ providedIn: 'root' })
export class ICMIdentityProvider implements IdentityProvider {
  constructor(
    private router: Router,
    private store: Store,
    private apiTokenService: ApiTokenService,
    private accountFacade: AccountFacade
  ) {}

  getCapabilities() {
    return {
      editPassword: true,
      editEmail: true,
      editProfile: true,
    };
  }

  init() {
    this.apiTokenService.restore$().subscribe(noop);

    this.apiTokenService.cookieVanishes$
      .pipe(withLatestFrom(this.apiTokenService.apiToken$))
      .subscribe(([type, apiToken]) => {
        this.accountFacade.logoutUser({ revokeApiToken: false });
        if (!apiToken) {
          this.accountFacade.fetchAnonymousToken();
        }
        if (type === 'user') {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url, messageKey: 'session_timeout' },
          });
        }
      });
  }

  triggerLogin(): TriggerReturnType {
    return true;
  }

  triggerLogout(): TriggerReturnType {
    this.accountFacade.logoutUser();
    return this.accountFacade.isLoggedIn$.pipe(
      // wait until the user is logged out before you go to homepage to prevent unnecessary REST calls
      filter(loggedIn => !loggedIn),
      take(1),
      switchMap(() =>
        this.store.pipe(
          select(selectQueryParam('returnUrl')),
          map(returnUrl => returnUrl || '/home'),
          map(returnUrl => this.router.parseUrl(returnUrl))
        )
      )
    );
  }

  triggerRegister(): TriggerReturnType {
    return true;
  }

  triggerInvite(route: ActivatedRouteSnapshot): TriggerReturnType {
    return this.router.createUrlTree(['forgotPassword', 'updatePassword'], {
      queryParams: { uid: route.queryParams.uid, Hash: route.queryParams.Hash },
    });
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.apiTokenService.intercept(req, next);
  }
}
