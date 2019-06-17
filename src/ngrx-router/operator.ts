import { Action } from '@ngrx/store';
import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ROUTER_NAVIGATION_TYPE, RouteNavigation } from './actions';

export function isRoute(route?: string | string[] | RegExp) {
  return (action: Action) => {
    const isRouteAction = action.type === ROUTER_NAVIGATION_TYPE;
    if (isRouteAction && route) {
      const routeAction = action as RouteNavigation;
      const routePath = routeAction.payload.path;
      if (Array.isArray(route)) {
        return route.indexOf(routePath) > -1;
      } else if (route instanceof RegExp) {
        return route.test(routePath);
      } else {
        return routePath === route;
      }
    }
    return isRouteAction;
  };
}

export function ofRoute(route?: string | string[] | RegExp): MonoTypeOperatorFunction<RouteNavigation> {
  return filter<RouteNavigation>(isRoute(route));
}

export function mapToParam<T>(key: string): OperatorFunction<RouteNavigation, T> {
  return map<RouteNavigation, T>(action => action.payload.params[key]);
}

export function mapToQueryParam<T>(key: string): OperatorFunction<RouteNavigation, T> {
  return map<RouteNavigation, T>(action => action.payload.queryParams[key]);
}

export function mapToData<T>(key: string): OperatorFunction<RouteNavigation, T> {
  return map<RouteNavigation, T>(action => action.payload.data[key]);
}
