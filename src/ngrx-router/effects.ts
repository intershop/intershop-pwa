import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationStart, NavigationEnd, Router } from '@angular/router';
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
      let route = event.snapshot as ActivatedRouteSnapshot;
      const path: any[] = [];
      const url: string[] = [];
      const { params, queryParams, data } = route;

      while (route.parent) {
        if (route.routeConfig && route.routeConfig.path) {
          path.push(route.routeConfig.path);
          route.url.reverse().forEach(l => {
            url.push(l.path);
          });
        }
        route = route.parent;
      }
      const routerState = {
        params: params || {},
        queryParams: queryParams || {},
        data: data || {},
        url: '/' + url.reverse().join('/'),
        path: path.reverse().join('/'),
      };
      return new RouteNavigation(routerState);
    })
  );
}
