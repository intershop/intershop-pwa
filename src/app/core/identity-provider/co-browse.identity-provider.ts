import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, noop, of, race, throwError } from 'rxjs';
import { catchError, concatMap, delay, filter, first, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { IdentityProvider, TriggerReturnType } from 'ish-core/identity-provider/identity-provider.interface';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class CoBrowseIdentityProvider implements IdentityProvider {
  constructor(
    protected router: Router,
    protected store: Store,
    protected apiTokenService: ApiTokenService,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade
  ) {}

  getCapabilities() {
    return {
      editPassword: false,
      editEmail: false,
      editProfile: false,
    };
  }

  init() {
    this.apiTokenService.cookieVanishes$
      .pipe(withLatestFrom(this.apiTokenService.apiToken$))
      .subscribe(([type, apiToken]) => {
        if (!apiToken) {
          this.accountFacade.fetchAnonymousToken();
        }
        if (type === 'user') {
          this.accountFacade.logoutUser({ revokeApiToken: false });
        }
      });

    // OAuth Service should be configured before apiToken information are restored and the refresh token mechanism is setup
    this.apiTokenService.restore$(['user', 'order']).subscribe(noop);

    this.checkoutFacade.basket$.pipe(whenTruthy(), first()).subscribe(basketView => {
      window.sessionStorage.setItem('basket-id', basketView.id);
    });
  }

  triggerLogin(route: ActivatedRouteSnapshot): TriggerReturnType {
    // check for required start parameters before doing anything with the co-browse route
    // ToDo: adapt parameter name
    if (!route.queryParamMap.has('access-token')) {
      this.appFacade.setBusinessError('cobrowse.error.missing.parameter');
      return false;
    }

    // ToDo: this functionality will change
    this.accountFacade.loginUserWithToken(route.queryParamMap.get('access-token'));

    return race(
      // throw an error if a user login error occurs
      this.accountFacade.userError$.pipe(
        whenTruthy(),
        take(1),
        concatMap(userError => throwError(() => userError))
      ),

      // handle the punchout functions once the punchout user is logged in
      this.accountFacade.isLoggedIn$.pipe(
        whenTruthy(),
        take(1),
        map(() => this.router.parseUrl('/home')),
        // punchout error after successful authentication (needs to logout)
        catchError(error =>
          this.accountFacade.userLoading$.pipe(
            first(loading => !loading),
            delay(0),
            switchMap(() => {
              this.accountFacade.logoutUser();
              this.apiTokenService.removeApiToken();
              this.appFacade.setBusinessError(error);
              return of(this.router.parseUrl('/error'));
            })
          )
        )
      )
    ).pipe(
      // general punchout error handling (parameter missing, authentication error)
      catchError(error => {
        this.appFacade.setBusinessError(error);
        return of(this.router.parseUrl('/error'));
      })
    );
  }

  triggerLogout(): TriggerReturnType {
    window.sessionStorage.removeItem('basket-id');
    this.accountFacade.logoutUser(); // user will be logged out and related refresh token is revoked on server
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

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.apiTokenService.intercept(req, next);
  }
}
