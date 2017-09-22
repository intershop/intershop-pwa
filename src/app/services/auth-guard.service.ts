import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService,
              private localize: LocalizeRouterService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!this.jwtService.getToken()) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.localize.navigateToRoute('/login', { queryParams: { returnUrl: state.url } });
    return false;
  }
}

