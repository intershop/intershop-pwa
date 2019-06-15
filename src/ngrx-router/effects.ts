// tslint:disable:no-any
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivationStart, NavigationEnd, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { debounce, filter, map, tap } from 'rxjs/operators';

import { ROUTER_BACK_TYPE, ROUTER_FORWARD_TYPE, ROUTER_GO_TYPE, RouteNavigation, RouterGo } from './actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType<RouterGo>(ROUTER_GO_TYPE),
    map(action => action.payload),
    tap(({ path, queryParams, extras }) => setTimeout(() => this.router.navigate(path, { queryParams, ...extras })))
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(ROUTER_BACK_TYPE),
    tap(() => setTimeout(() => this.location.back()))
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(ROUTER_FORWARD_TYPE),
    tap(() => setTimeout(() => this.location.forward()))
  );

  constructor(private actions$: Actions, private router: Router, private location: Location, private store: Store<{}>) {
    this.listenToRouter();
  }

  private navEnd$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

  private listenToRouter() {
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationStart),
        debounce(() => this.navEnd$)
      )
      .subscribe((event: any) => {
        let route = event.snapshot;
        const path: any[] = [];
        const { params, queryParams, data } = route;

        while (route.parent) {
          if (route.routeConfig && route.routeConfig.path) {
            path.push(route.routeConfig.path);
          }
          route = route.parent;
        }
        const routerState = { params, queryParams, data, path: path.reverse().join('/') };
        this.store.dispatch(new RouteNavigation(routerState));
      });
  }
}
