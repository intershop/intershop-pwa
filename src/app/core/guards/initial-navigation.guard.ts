import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { ApplyConfiguration } from 'ish-core/store/configuration';
import { ConfigurationState } from 'ish-core/store/configuration/configuration.reducer';

@Injectable({ providedIn: 'root' })
export class InitialNavigationGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private store: Store<{}>) {}

  private do(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const keys: (keyof ConfigurationState)[] = ['channel', 'baseURL'];
    const properties = keys
      .filter(key => next.params[key])
      .map(key => ({ [key]: next.params[key] }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});

    if (Object.keys(properties).length) {
      this.store.dispatch(new ApplyConfiguration(properties));

      if (next.params.redirect) {
        const navigateTo = state.url.match(/\/(.*?);/)[1];
        return this.router.parseUrl(navigateTo);
      }
    }

    return true;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.do(next, state);
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.do(next, state);
  }
}
