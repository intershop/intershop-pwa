import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Injectable()
export class RegistrationGuard implements CanActivate {

  constructor(private globalConfiguration: GlobalConfiguration,
    private localize: LocalizeRouterService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.globalConfiguration.getApplicationSettings().toPromise().then(settings => {
      if (!settings.useSimpleAccount) {
        return true;
      } else {
        this.router.config[0].children = this.router.config[0].children.filter(item => {
          return item.path !== 'register';
        });
        this.router.config[0].children.push(
          { path: 'register', loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' }
        );
        this.localize.navigateToRoute(state.url.slice(1));
        return false;
      }
    });
  }
}

