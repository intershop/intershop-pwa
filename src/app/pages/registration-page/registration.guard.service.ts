import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Injectable()
export class RegistrationGuard implements CanActivate {

  constructor(private globalConfiguration: GlobalConfiguration,
    private localizeRouter: LocalizeRouterService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.globalConfiguration.getApplicationSettings().toPromise().then(settings => {
      if (!settings.useSimpleAccount) {
        return true;
      }
      this.router.config.forEach(routes => {
        this.modifyExisitingRoute(routes);
      });
      this.localizeRouter.navigateToRoute(state.url.slice(1));
      return false;
    });
  }

  modifyExisitingRoute(routes) {
    const register = 'register';
    if (routes.children) {
      routes.children.forEach(function(children, index) {
        if (children.path === register) {
          routes.children.splice(index, 1);
          routes.children[index] = { path: register, loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' };
        }
      });
    }
  }
}

