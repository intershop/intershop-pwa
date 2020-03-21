import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Wishlist } from '../../models/wishlist/wishlist.model';

import { WishlistsAction, WishlistsActionTypes } from './wishlist.actions';

export interface WishlistState extends EntityState<Wishlist> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const wishlistsAdapter = createEntityAdapter<Wishlist>({
  selectId: wishlist => wishlist.id,
});

export const initialState = wishlistsAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export function wishlistReducer(state = initialState, action: WishlistsAction): WishlistState {
  switch (action.type) {
    case WishlistsActionTypes.LoadWishlists:
    case WishlistsActionTypes.CreateWishlist:
    case WishlistsActionTypes.DeleteWishlist:
    case WishlistsActionTypes.UpdateWishlist: {
      return {
        ...state,
        loading: true,
      };
    }
    case WishlistsActionTypes.LoadWishlistsFail:
    case WishlistsActionTypes.DeleteWishlistFail:
    case WishlistsActionTypes.CreateWishlistFail:
    case WishlistsActionTypes.UpdateWishlistFail: {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
        selected: undefined,
      };
    }

    case WishlistsActionTypes.LoadWishlistsSuccess: {
      const { wishlists } = action.payload;
      return wishlistsAdapter.setAll(wishlists, {
        ...state,
        loading: false,
      });
    }

    case WishlistsActionTypes.UpdateWishlistSuccess:
    case WishlistsActionTypes.AddProductToWishlistSuccess:
    case WishlistsActionTypes.RemoveItemFromWishlistSuccess:
    case WishlistsActionTypes.CreateWishlistSuccess: {
      const { wishlist } = action.payload;

      return wishlistsAdapter.upsertOne(wishlist, {
        ...state,
        loading: false,
      });
    }

    case WishlistsActionTypes.DeleteWishlistSuccess: {
      const { wishlistId } = action.payload;
      return wishlistsAdapter.removeOne(wishlistId, {
        ...state,
        loading: false,
      });
    }

    case WishlistsActionTypes.SelectWishlist: {
      const { id } = action.payload;
      return {
        ...state,
        selected: id,
      };
    }

    case WishlistsActionTypes.ResetWishlistState: {
      return initialState;
    }
  }

  return state;
}
