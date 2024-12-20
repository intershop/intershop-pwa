import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { wishlistActions } from '../store/wishlist';

/**
 * Fetch the shared wishlist
 */
export function fetchSharedWishlistGuard(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
  const store = inject(Store);
  const wishlistId = route.params.wishlistId;
  const owner = route.queryParams.owner;
  const secureCode = route.queryParams.secureCode;

  store.dispatch(
    wishlistActions.loadSharedWishlist({
      wishlistId,
      owner,
      secureCode,
    })
  );
  return of(true);
}
