import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';

import { setSeoAttributes } from '../store/seo';

const defaults: SeoAttributes = {
  title: 'seo.defaults.title',
  description: 'seo.defaults.description',
  robots: 'index, follow',
  'og:type': 'website',
};

@Injectable({ providedIn: 'root' })
export class MetaGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean {
    const metaSettings = route.hasOwnProperty('data') ? route.data.meta : undefined;
    this.store.dispatch(setSeoAttributes({ ...defaults, ...metaSettings }));

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
