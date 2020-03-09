import { Action } from '@ngrx/store';
import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ROUTER_NAVIGATION_TYPE, RouteNavigation } from './actions';

export function isRoute(route?: string | string[] | RegExp) {
  return (action: Action) => {
    const isRouteAction = action.type === ROUTER_NAVIGATION_TYPE;
    if (isRouteAction && route) {
      const routeAction = action as RouteNavigation;
      const pathOrUrl = [routeAction.payload.path, routeAction.payload.url];
      if (Array.isArray(route)) {
        return pathOrUrl.some(str => route.indexOf(str) > -1);
      } else if (route instanceof RegExp) {
        return pathOrUrl.some(str => route.test(str));
      } else if (typeof route === 'string') {
        return pathOrUrl.some(str => str === route);
      }
    }
    return isRouteAction;
  };
}

export function ofRoute(route?: string | string[] | RegExp): MonoTypeOperatorFunction<RouteNavigation> {
  return filter<RouteNavigation>(isRoute(route));
}

export function mapToParam<T>(key: string): OperatorFunction<RouteNavigation, T> {
  return map<RouteNavigation, T>(action => action.payload.params && action.payload.params[key]);
}

export function mapToQueryParam<T>(key: string): OperatorFunction<RouteNavigation, T> {
  return map<RouteNavigation, T>(action => action.payload.queryParams && action.payload.queryParams[key]);
}

export function mapToData<T>(key: string): OperatorFunction<RouteNavigation, T> {
  return map<RouteNavigation, T>(action => action.payload.data && action.payload.data[key]);
}
