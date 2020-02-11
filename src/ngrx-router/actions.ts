import { Action } from '@ngrx/store';

export const ROUTER_NAVIGATION_TYPE = '[Router] Navigation';

export class RouteNavigation implements Action {
  readonly type = ROUTER_NAVIGATION_TYPE;
  // tslint:disable-next-line:no-any
  constructor(public payload: { path: string; url?: string; params?: any; queryParams?: any; data?: any }) {
    if (!this.payload.url) {
      this.payload.url = '/' + this.payload.path;
    }
  }
}
