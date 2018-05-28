import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, pluck } from 'rxjs/operators';

/**
 * resolves data from child routes
 */
export function resolveChildRouteData<T>(route: ActivatedRoute, router: Router, key: string): Observable<T> {
  return merge(
    // get first data from injected activated route
    route.firstChild.data.pipe(pluck(key)),
    // listen to router events to get other child updates
    router.events.pipe(
      filter(event => event instanceof ChildActivationEnd),
      pluck('snapshot', 'data', key),
      filter((x: T) => !!x)
    )
  ).pipe(distinctUntilChanged());
}
