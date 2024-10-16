import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { isSharedWishlistLoaded, isSharedWishlistLoading, wishlistActions } from '../store/wishlist';

/**
 * Fetch the shared wishlist
 */
export function fetchSharedWishlistGuard(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
  const store = inject(Store);
  const wishlistId = route.params.wishlistId;
  const owner = route.queryParams.owner;
  const secureCode = route.queryParams.secureCode;

  return store.pipe(
    select(isSharedWishlistLoaded(wishlistId)),
    switchMap(loaded => {
      if (loaded) {
        return of(true);
      }

      return store.pipe(
        select(isSharedWishlistLoading(wishlistId)),
        tap(loading => {
          if (!loading) {
            store.dispatch(
              wishlistActions.loadSharedWishlist({
                wishlistId,
                owner,
                secureCode,
              })
            );
          }
        }),
        map(() => true)
      );
    })
  );
}
