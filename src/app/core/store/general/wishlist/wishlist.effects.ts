import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { WishlistService } from 'ish-core/services/wishlist/wishlist.service';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { loadWishlist, loadWishlistFail, loadWishlistSuccess } from './wishlist.actions';

@Injectable()
export class WishlistEffects {
  constructor(private actions$: Actions, private wishlistService: WishlistService) {}

  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWishlist),
      mergeMap(action =>
        this.wishlistService.getWishlist(action.payload.id, action.payload.owner, action.payload.secureCode).pipe(
          map(wishlist => loadWishlistSuccess({ wishlist })),
          mapErrorToAction(loadWishlistFail)
        )
      )
    )
  );
}
