import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AccountLoginService } from './account-login/account-login.service';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private localize: LocalizeRouterService,
              private accountLoginService: AccountLoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.accountLoginService.isAuthorized()) {
      // not logged in so redirect to login page with the return url
      this.localize.navigateToRoute('/login', { queryParams: { returnUrl: state.url } });
      return false;
    }

    return true;
    /*if (!!this.jwtService.getToken()) {
      return true;
    }*/


  }
}

