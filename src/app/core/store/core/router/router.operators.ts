import { RouterNavigatedAction, RouterNavigationAction } from '@ngrx/router-store';
import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RouterState } from './router.reducer';
import { selectUrl } from './router.selectors';

/**
 * Yields the state object every time the current URL matches the given pattern.
 *
 * This operator should be followed directly by a state selector.
 */
export function ofUrl(url: RegExp): MonoTypeOperatorFunction<{}> {
  return source$ => source$.pipe(filter(state => url.test(selectUrl(state))));
}

export function mapToRouterState(): OperatorFunction<RouterNavigatedAction | RouterNavigationAction, RouterState> {
  return map<{ payload: { routerState: unknown } }, RouterState>(action => action?.payload.routerState as RouterState);
}
