import { Injectable } from '@angular/core';
import { ActivationStart, NavigationEnd, Router } from '@angular/router';
import { Effect } from '@ngrx/effects';
import { debounce, filter, map } from 'rxjs/operators';

import { RouteNavigation } from './actions';

@Injectable()
// tslint:disable:no-any
export class RouterEffects {
  constructor(private router: Router) {}

  private navEnd$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

  @Effect()
  listenToRouter$ = this.router.events.pipe(
    filter(event => event instanceof ActivationStart),
    debounce(() => this.navEnd$),
    map((event: any) => {
      let route = event.snapshot;
      const path: any[] = [];
      const { params, queryParams, data } = route;

      while (route.parent) {
        if (route.routeConfig) {
          if (route.routeConfig.path) {
            path.push(route.routeConfig.path);
          } else if (route.routeConfig.data && route.routeConfig.data.format) {
            path.push(route.routeConfig.data.format);
          }
        }
        route = route.parent;
      }
      const routerState = { params, queryParams, data, path: path.reverse().join('/') };
      return new RouteNavigation(routerState);
    })
  );
}
