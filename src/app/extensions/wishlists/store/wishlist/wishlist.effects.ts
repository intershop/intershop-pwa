import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { SuccessMessage } from 'ish-core/store/messages';
import { selectRouteParam } from 'ish-core/store/router';
import { UserActionTypes, getUserAuthorized } from 'ish-core/store/user';
import { SetBreadcrumbData } from 'ish-core/store/viewconf';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';
import { WishlistService } from '../../services/wishlist/wishlist.service';

import * as wishlistsActions from './wishlist.actions';
import { getSelectedWishlistDetails, getSelectedWishlistId, getWishlistDetails } from './wishlist.selectors';

@Injectable()
export class WishlistEffects {
  constructor(private actions$: Actions, private wishlistService: WishlistService, private store: Store<{}>) {}

  @Effect()
  loadWishlists$ = this.actions$.pipe(
    ofType<wishlistsActions.LoadWishlists>(wishlistsActions.WishlistsActionTypes.LoadWishlists),
    withLatestFrom(this.store.pipe(select(getUserAuthorized))),
    filter(([, authorized]) => authorized),
    switchMap(() =>
      this.wishlistService.getWishlists().pipe(
        map(wishlists => new wishlistsActions.LoadWishlistsSuccess({ wishlists })),
        mapErrorToAction(wishlistsActions.LoadWishlistsFail)
      )
    )
  );

  @Effect()
  createWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.CreateWishlist>(wishlistsActions.WishlistsActionTypes.CreateWishlist),
    mapToPayloadProperty('wishlist'),
    mergeMap((wishlistData: WishlistHeader) =>
      this.wishlistService.createWishlist(wishlistData).pipe(
        mergeMap(wishlist => [
          new wishlistsActions.CreateWishlistSuccess({ wishlist }),
          new SuccessMessage({
            message: 'account.wishlists.new_wishlist.confirmation',
            messageParams: { 0: wishlist.title },
          }),
        ]),
        mapErrorToAction(wishlistsActions.CreateWishlistFail)
      )
    )
  );

  @Effect()
  deleteWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.DeleteWishlist>(wishlistsActions.WishlistsActionTypes.DeleteWishlist),
    mapToPayloadProperty('wishlistId'),
    mergeMap(wishlistId => this.store.pipe(select(getWishlistDetails, { id: wishlistId }))),
    whenTruthy(),
    map(wishlist => ({ wishlistId: wishlist.id, title: wishlist.title })),
    mergeMap(({ wishlistId, title }) =>
      this.wishlistService.deleteWishlist(wishlistId).pipe(
        mergeMap(() => [
          new wishlistsActions.DeleteWishlistSuccess({ wishlistId }),
          new SuccessMessage({
            message: 'account.wishlists.delete_wishlist.confirmation',
            messageParams: { 0: title },
          }),
        ]),
        mapErrorToAction(wishlistsActions.DeleteWishlistFail)
      )
    )
  );

  @Effect()
  updateWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.UpdateWishlist>(wishlistsActions.WishlistsActionTypes.UpdateWishlist),
    mapToPayloadProperty('wishlist'),
    mergeMap((newWishlist: Wishlist) =>
      this.wishlistService.updateWishlist(newWishlist).pipe(
        mergeMap(wishlist => [
          new wishlistsActions.UpdateWishlistSuccess({ wishlist }),
          new SuccessMessage({
            message: 'account.wishlists.edit_wishlist.confirmation',
            messageParams: { 0: wishlist.title },
          }),
        ]),
        mapErrorToAction(wishlistsActions.UpdateWishlistFail)
      )
    )
  );

  /**
   * Reload Wishlists after a creation or update to ensure integrity with server concerning the preferred wishlist
   */
  @Effect()
  reloadWishlists$ = this.actions$.pipe(
    ofType<wishlistsActions.UpdateWishlistSuccess | wishlistsActions.CreateWishlistSuccess>(
      wishlistsActions.WishlistsActionTypes.UpdateWishlistSuccess,
      wishlistsActions.WishlistsActionTypes.CreateWishlistSuccess
    ),
    mapToPayloadProperty('wishlist'),
    filter(wishlist => wishlist && wishlist.preferred),
    mapTo(new wishlistsActions.LoadWishlists())
  );

  @Effect()
  addProductToWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.AddProductToWishlist>(wishlistsActions.WishlistsActionTypes.AddProductToWishlist),
    mapToPayload(),
    mergeMap(payload =>
      this.wishlistService.addProductToWishlist(payload.wishlistId, payload.sku, payload.quantity).pipe(
        map(wishlist => new wishlistsActions.AddProductToWishlistSuccess({ wishlist })),
        mapErrorToAction(wishlistsActions.AddProductToWishlistFail)
      )
    )
  );

  @Effect()
  addProductToNewWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.AddProductToNewWishlist>(wishlistsActions.WishlistsActionTypes.AddProductToNewWishlist),
    mapToPayload(),
    mergeMap(payload =>
      this.wishlistService
        .createWishlist({
          title: payload.title,
          preferred: false,
        })
        .pipe(
          // use created wishlist data to dispatch addProduct action
          mergeMap(wishlist => [
            new wishlistsActions.CreateWishlistSuccess({ wishlist }),
            new wishlistsActions.AddProductToWishlist({ wishlistId: wishlist.id, sku: payload.sku }),
            new wishlistsActions.SelectWishlist({ id: wishlist.id }),
          ]),
          mapErrorToAction(wishlistsActions.CreateWishlistFail)
        )
    )
  );

  @Effect()
  moveItemToWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.MoveItemToWishlist>(wishlistsActions.WishlistsActionTypes.MoveItemToWishlist),
    mapToPayload(),
    mergeMap(payload => {
      if (!payload.target.id) {
        return [
          new wishlistsActions.AddProductToNewWishlist({ title: payload.target.title, sku: payload.target.sku }),
          new wishlistsActions.RemoveItemFromWishlist({ wishlistId: payload.source.id, sku: payload.target.sku }),
        ];
      } else {
        return [
          new wishlistsActions.AddProductToWishlist({ wishlistId: payload.target.id, sku: payload.target.sku }),
          new wishlistsActions.RemoveItemFromWishlist({ wishlistId: payload.source.id, sku: payload.target.sku }),
        ];
      }
    })
  );

  @Effect()
  removeProductFromWishlist$ = this.actions$.pipe(
    ofType<wishlistsActions.RemoveItemFromWishlist>(wishlistsActions.WishlistsActionTypes.RemoveItemFromWishlist),
    mapToPayload(),
    mergeMap(payload =>
      this.wishlistService.removeProductFromWishlist(payload.wishlistId, payload.sku).pipe(
        map(wishlist => new wishlistsActions.RemoveItemFromWishlistSuccess({ wishlist })),
        mapErrorToAction(wishlistsActions.RemoveItemFromWishlistFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectedWishlist$ = this.store.pipe(
    select(selectRouteParam('wishlistName')),
    distinctCompareWith(this.store.pipe(select(getSelectedWishlistId))),
    map(id => new wishlistsActions.SelectWishlist({ id }))
  );

  /**
   * Trigger LoadWishlists action after LoginUserSuccess.
   */
  @Effect()
  loadWishlistsAfterLogin$ = this.store.pipe(
    select(getUserAuthorized),
    whenTruthy(),
    mapTo(new wishlistsActions.LoadWishlists())
  );

  /**
   * Trigger ResetWishlistState action after LogoutUser.
   */
  @Effect()
  resetWishlistStateAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),

    mapTo(new wishlistsActions.ResetWishlistState())
  );

  @Effect()
  setWishlistBreadcrumb$ = this.store.pipe(
    select(getSelectedWishlistDetails),
    whenTruthy(),
    map(
      wishlist =>
        new SetBreadcrumbData({
          breadcrumbData: [
            { key: 'account.wishlists.breadcrumb_link', link: '/account/wishlists' },
            { text: wishlist.title },
          ],
        })
    )
  );
}
