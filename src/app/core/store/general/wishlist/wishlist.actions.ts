import { createAction } from '@ngrx/store';

import { Wishlist } from 'ish-core/models/wishlist/wishlist.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadWishlist = createAction(
  '[Wishlist] Load Shared Wishlist',
  payload<{ id: string; owner: string; secureCode: string }>()
);

export const loadWishlistSuccess = createAction(
  '[Wishlist API] Load Shared Wishlist Success',
  payload<{ wishlist: Wishlist }>()
);

export const loadWishlistFail = createAction('[Wishlist API] Load Shared Wishlist Failure', httpError());
