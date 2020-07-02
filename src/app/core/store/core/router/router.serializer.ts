import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterState } from './router.reducer';

/**
 * custom router serializer, so we can use it with runtime checks
 * @see https://ngrx.io/guide/router-store/configuration#default-router-state-serializer
 */
export class CustomRouterSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    let route = routerState.root;

    let data = route.data;
    let params = route.params;
    let path = route.routeConfig?.path;
    while (route.firstChild) {
      route = route.firstChild;
      data = { ...data, ...route.data };
      params = { ...params, ...route.params };
      if (route.routeConfig?.path) {
        if (path) {
          path += '/' + route.routeConfig.path;
        } else {
          path = route.routeConfig.path;
        }
      }
    }

    const {
      url,
      root: { queryParams },
    } = routerState;

    return { url, params, queryParams, data, path };
  }
}
