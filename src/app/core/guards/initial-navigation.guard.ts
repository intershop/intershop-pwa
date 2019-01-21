import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { ApplyConfiguration } from 'ish-core/store/configuration';
import { ConfigurationState } from 'ish-core/store/configuration/configuration.reducer';
import { SelectLocale } from 'ish-core/store/locale';

@Injectable({ providedIn: 'root' })
export class InitialNavigationGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private store: Store<{}>) {}

  private do(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const keys: (keyof ConfigurationState)[] = ['channel', 'baseURL', 'application'];
    const properties: { [id: string]: unknown } = keys
      .filter(key => next.paramMap.has(key))
      .map(key => ({ [key]: next.paramMap.get(key) }))
      .reduce((acc, val) => ({ ...acc, ...val }), {});

    if (next.paramMap.has('features')) {
      properties.features = next.paramMap.get('features').split(/,/g);
    }

    if (next.paramMap.has('lang')) {
      const lang = next.paramMap.get('lang');
      this.store.dispatch(new SelectLocale({ lang }));
    }

    if (Object.keys(properties).length) {
      this.store.dispatch(new ApplyConfiguration(properties));
    }

    if (next.paramMap.has('redirect')) {
      const params = state.url.match(/\/.*?(;[^?]*).*?/);
      const navigateTo = state.url.replace(params[1], '');
      return this.router.parseUrl(navigateTo);
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
