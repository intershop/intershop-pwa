import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import * as fromRouter from '../reducers/router.reducer';

export class CustomSerializer implements RouterStateSerializer<fromRouter.RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): fromRouter.RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    let params = {};

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
      params = { ...params, ...state.params };
    }

    return { url, queryParams, params };
  }
}
