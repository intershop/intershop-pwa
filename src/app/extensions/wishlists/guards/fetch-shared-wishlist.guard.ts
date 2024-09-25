import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { wishlistActions } from '../store/wishlist';

/**
 * Fetch the shared wishlist
 */
export function fetchSharedWishlistGuard(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
  const store = inject(Store);

  return store.pipe(
    tap(() => {
      store.dispatch(
        wishlistActions.loadSharedWishlist({
          wishlistId: route.params.wishlistId,
          owner: route.queryParams.owner,
          secureCode: route.queryParams.secureCode,
        })
      );
    }),
    map(() => true)
  );
}
