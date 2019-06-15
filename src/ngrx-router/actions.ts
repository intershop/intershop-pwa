// tslint:disable:no-any
import { NavigationExtras } from '@angular/router';
import { Action } from '@ngrx/store';

export const ROUTER_GO_TYPE = '[Router] Go';
export const ROUTER_BACK_TYPE = '[Router] Back';
export const ROUTER_FORWARD_TYPE = '[Router] Forward';
export const ROUTER_NAVIGATION_TYPE = '[Router] Navigation';

export class RouterGo implements Action {
  readonly type = ROUTER_GO_TYPE;

  constructor(
    public payload: {
      path: any[];
      queryParams?: object;
      extras?: NavigationExtras;
    }
  ) {}
}

export class RouterBack implements Action {
  readonly type = ROUTER_BACK_TYPE;
}

export class RouterForward implements Action {
  readonly type = ROUTER_FORWARD_TYPE;
}

export class RouteNavigation implements Action {
  readonly type = ROUTER_NAVIGATION_TYPE;
  constructor(public payload: { path: string; params?: any; queryParams?: any; data?: any }) {}
}
