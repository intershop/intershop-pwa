import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { GlobalConfiguration } from '../../configurations/global.configuration';

@Injectable()
export class RegistrationGuard implements CanActivate {

  constructor(private globalConfiguration: GlobalConfiguration,
    private localize: LocalizeRouterService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.globalConfiguration.getApplicationSettings().subscribe(settings => {
      if (!settings.useSimpleAccount) {
        return true;
      }
    })
    this.router.config[0].children = this.router.config[0].children.filter(item => {
      return item.path !== 'register';
    })
    this.router.config[0].children.push(
      { path: 'register', loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' }
    )
    this.localize.navigateToRoute('en_US/USD/register');
    return false;
  }
}

