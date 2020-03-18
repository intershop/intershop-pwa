import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { selectUrl } from './router.selectors';

/**
 * Yields the state object every time the current URL matches the given pattern.
 *
 * This operator should be followed directly by a state selector.
 */
export function ofUrl(url: RegExp): MonoTypeOperatorFunction<{}> {
  return source$ => source$.pipe(filter(state => url.test(selectUrl(state))));
}
