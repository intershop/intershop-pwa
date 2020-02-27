import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';

export enum WishlistsActionTypes {
  LoadWishlists = '[Wishlists Internal] Load Wishlists',
  LoadWishlistsSuccess = '[Wishlists API] Load Wishlists Success',
  LoadWishlistsFail = '[Wishlists API] Load Wishlists Fail',

  CreateWishlist = '[Wishlists] Create Wishlist',
  CreateWishlistSuccess = '[Wishlists API] Create Wishlist Success',
  CreateWishlistFail = '[Wishlists API] Create Wishlist Fail',

  UpdateWishlist = '[Wishlists] Update Wishlist',
  UpdateWishlistSuccess = '[Wishlists API] Update Wishlist Success',
  UpdateWishlistFail = '[Wishlists API] Update Wishlist Fail',

  DeleteWishlist = '[Wishlists] Delete Wishlist',
  DeleteWishlistSuccess = '[Wishlists API] Delete Wishlist Success',
  DeleteWishlistFail = '[Wishlists API] Delete Wishlist Fail',

  AddProductToWishlist = '[Wishlists] Add Item to Wishlist',
  AddProductToWishlistSuccess = '[Wishlists API] Add Item to Wishlist Success',
  AddProductToWishlistFail = '[Wishlists API] Add Item to Wishlist Fail',

  AddProductToNewWishlist = '[Wishlists Internal] Add Product To New Wishlist',

  MoveItemToWishlist = '[Wishlists] Move Item to another Wishlist',

  RemoveItemFromWishlist = '[Wishlists] Remove Item from Wishlist',
  RemoveItemFromWishlistSuccess = '[Wishlists API] Remove Item from Wishlist Success',
  RemoveItemFromWishlistFail = '[Wishlists API] Remove Item from Wishlist Fail',

  SelectWishlist = '[Wishlists Internal] Select Wishlist',
  ResetWishlistState = '[Wishlists Internal] Reset Wishlist State',
}

export class LoadWishlists implements Action {
  readonly type = WishlistsActionTypes.LoadWishlists;
}

export class LoadWishlistsSuccess implements Action {
  readonly type = WishlistsActionTypes.LoadWishlistsSuccess;
  constructor(public payload: { wishlists: Wishlist[] }) {}
}

export class LoadWishlistsFail implements Action {
  readonly type = WishlistsActionTypes.LoadWishlistsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateWishlist implements Action {
  readonly type = WishlistsActionTypes.CreateWishlist;
  constructor(public payload: { wishlist: WishlistHeader }) {}
}

export class CreateWishlistSuccess implements Action {
  readonly type = WishlistsActionTypes.CreateWishlistSuccess;
  constructor(public payload: { wishlist: Wishlist }) {}
}

export class CreateWishlistFail implements Action {
  readonly type = WishlistsActionTypes.CreateWishlistFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateWishlist implements Action {
  readonly type = WishlistsActionTypes.UpdateWishlist;
  constructor(public payload: { wishlist: Wishlist }) {}
}

export class UpdateWishlistSuccess implements Action {
  readonly type = WishlistsActionTypes.UpdateWishlistSuccess;
  constructor(public payload: { wishlist: Wishlist }) {}
}

export class UpdateWishlistFail implements Action {
  readonly type = WishlistsActionTypes.UpdateWishlistFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteWishlist implements Action {
  readonly type = WishlistsActionTypes.DeleteWishlist;
  constructor(public payload: { wishlistId: string }) {}
}

export class DeleteWishlistSuccess implements Action {
  readonly type = WishlistsActionTypes.DeleteWishlistSuccess;

  constructor(public payload: { wishlistId: string }) {}
}

export class DeleteWishlistFail implements Action {
  readonly type = WishlistsActionTypes.DeleteWishlistFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddProductToWishlist implements Action {
  readonly type = WishlistsActionTypes.AddProductToWishlist;
  constructor(public payload: { wishlistId: string; sku: string; quantity?: number }) {}
}

export class AddProductToWishlistSuccess implements Action {
  readonly type = WishlistsActionTypes.AddProductToWishlistSuccess;
  constructor(public payload: { wishlist: Wishlist }) {}
}

export class AddProductToWishlistFail implements Action {
  readonly type = WishlistsActionTypes.AddProductToWishlistFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddProductToNewWishlist implements Action {
  readonly type = WishlistsActionTypes.AddProductToNewWishlist;
  constructor(public payload: { title: string; sku: string }) {}
}

export class MoveItemToWishlist implements Action {
  readonly type = WishlistsActionTypes.MoveItemToWishlist;
  constructor(public payload: { source: { id: string }; target: { id?: string; title?: string; sku: string } }) {}
}

export class RemoveItemFromWishlist implements Action {
  readonly type = WishlistsActionTypes.RemoveItemFromWishlist;
  constructor(public payload: { wishlistId: string; sku: string }) {}
}

export class RemoveItemFromWishlistSuccess implements Action {
  readonly type = WishlistsActionTypes.RemoveItemFromWishlistSuccess;
  constructor(public payload: { wishlist: Wishlist }) {}
}

export class RemoveItemFromWishlistFail implements Action {
  readonly type = WishlistsActionTypes.RemoveItemFromWishlistFail;
  constructor(public payload: { error: HttpError }) {}
}

export class SelectWishlist implements Action {
  readonly type = WishlistsActionTypes.SelectWishlist;
  constructor(public payload: { id: string }) {}
}

export class ResetWishlistState implements Action {
  readonly type = WishlistsActionTypes.ResetWishlistState;
}

export type WishlistsAction =
  | LoadWishlists
  | LoadWishlistsSuccess
  | LoadWishlistsFail
  | CreateWishlist
  | CreateWishlistSuccess
  | CreateWishlistFail
  | UpdateWishlist
  | UpdateWishlistSuccess
  | UpdateWishlistFail
  | DeleteWishlist
  | DeleteWishlistSuccess
  | DeleteWishlistFail
  | AddProductToWishlist
  | AddProductToWishlistSuccess
  | AddProductToWishlistFail
  | AddProductToNewWishlist
  | MoveItemToWishlist
  | RemoveItemFromWishlist
  | RemoveItemFromWishlistSuccess
  | RemoveItemFromWishlistFail
  | SelectWishlist
  | ResetWishlistState;
