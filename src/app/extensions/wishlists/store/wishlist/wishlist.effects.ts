import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { debounceTime, filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { getUserAuthorized } from 'ish-core/store/account/user';
import { SuccessMessage } from 'ish-core/store/core/messages';
import { selectRouteParam } from 'ish-core/store/core/router';
import { SetBreadcrumbData } from 'ish-core/store/core/viewconf';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';
import { WishlistService } from '../../services/wishlist/wishlist.service';

import {
  AddProductToNewWishlist,
  AddProductToWishlist,
  AddProductToWishlistFail,
  AddProductToWishlistSuccess,
  CreateWishlist,
  CreateWishlistFail,
  CreateWishlistSuccess,
  DeleteWishlist,
  DeleteWishlistFail,
  DeleteWishlistSuccess,
  LoadWishlists,
  LoadWishlistsFail,
  LoadWishlistsSuccess,
  MoveItemToWishlist,
  RemoveItemFromWishlist,
  RemoveItemFromWishlistFail,
  RemoveItemFromWishlistSuccess,
  SelectWishlist,
  UpdateWishlist,
  UpdateWishlistFail,
  UpdateWishlistSuccess,
  WishlistsActionTypes,
} from './wishlist.actions';
import { getSelectedWishlistDetails, getSelectedWishlistId, getWishlistDetails } from './wishlist.selectors';

@Injectable()
export class WishlistEffects {
  constructor(private actions$: Actions, private wishlistService: WishlistService, private store: Store) {}

  @Effect()
  loadWishlists$ = this.actions$.pipe(
    ofType<LoadWishlists>(WishlistsActionTypes.LoadWishlists),
    withLatestFrom(this.store.pipe(select(getUserAuthorized))),
    filter(([, authorized]) => authorized),
    switchMap(() =>
      this.wishlistService.getWishlists().pipe(
        map(wishlists => new LoadWishlistsSuccess({ wishlists })),
        mapErrorToAction(LoadWishlistsFail)
      )
    )
  );

  @Effect()
  createWishlist$ = this.actions$.pipe(
    ofType<CreateWishlist>(WishlistsActionTypes.CreateWishlist),
    mapToPayloadProperty('wishlist'),
    mergeMap((wishlistData: WishlistHeader) =>
      this.wishlistService.createWishlist(wishlistData).pipe(
        mergeMap(wishlist => [
          new CreateWishlistSuccess({ wishlist }),
          new SuccessMessage({
            message: 'account.wishlists.new_wishlist.confirmation',
            messageParams: { 0: wishlist.title },
          }),
        ]),
        mapErrorToAction(CreateWishlistFail)
      )
    )
  );

  @Effect()
  deleteWishlist$ = this.actions$.pipe(
    ofType<DeleteWishlist>(WishlistsActionTypes.DeleteWishlist),
    mapToPayloadProperty('wishlistId'),
    mergeMap(wishlistId => this.store.pipe(select(getWishlistDetails, { id: wishlistId }))),
    whenTruthy(),
    map(wishlist => ({ wishlistId: wishlist.id, title: wishlist.title })),
    mergeMap(({ wishlistId, title }) =>
      this.wishlistService.deleteWishlist(wishlistId).pipe(
        mergeMap(() => [
          new DeleteWishlistSuccess({ wishlistId }),
          new SuccessMessage({
            message: 'account.wishlists.delete_wishlist.confirmation',
            messageParams: { 0: title },
          }),
        ]),
        mapErrorToAction(DeleteWishlistFail)
      )
    )
  );

  @Effect()
  updateWishlist$ = this.actions$.pipe(
    ofType<UpdateWishlist>(WishlistsActionTypes.UpdateWishlist),
    mapToPayloadProperty('wishlist'),
    mergeMap((newWishlist: Wishlist) =>
      this.wishlistService.updateWishlist(newWishlist).pipe(
        mergeMap(wishlist => [
          new UpdateWishlistSuccess({ wishlist }),
          new SuccessMessage({
            message: 'account.wishlists.edit_wishlist.confirmation',
            messageParams: { 0: wishlist.title },
          }),
        ]),
        mapErrorToAction(UpdateWishlistFail)
      )
    )
  );

  /**
   * Reload Wishlists after a creation or update to ensure integrity with server concerning the preferred wishlist
   */
  @Effect()
  reloadWishlists$ = this.actions$.pipe(
    ofType<UpdateWishlistSuccess | CreateWishlistSuccess>(
      WishlistsActionTypes.UpdateWishlistSuccess,
      WishlistsActionTypes.CreateWishlistSuccess
    ),
    mapToPayloadProperty('wishlist'),
    filter(wishlist => wishlist && wishlist.preferred),
    mapTo(new LoadWishlists())
  );

  @Effect()
  addProductToWishlist$ = this.actions$.pipe(
    ofType<AddProductToWishlist>(WishlistsActionTypes.AddProductToWishlist),
    mapToPayload(),
    mergeMap(payload =>
      this.wishlistService.addProductToWishlist(payload.wishlistId, payload.sku, payload.quantity).pipe(
        map(wishlist => new AddProductToWishlistSuccess({ wishlist })),
        mapErrorToAction(AddProductToWishlistFail)
      )
    )
  );

  @Effect()
  addProductToNewWishlist$ = this.actions$.pipe(
    ofType<AddProductToNewWishlist>(WishlistsActionTypes.AddProductToNewWishlist),
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
            new CreateWishlistSuccess({ wishlist }),
            new AddProductToWishlist({ wishlistId: wishlist.id, sku: payload.sku }),
            new SelectWishlist({ id: wishlist.id }),
          ]),
          mapErrorToAction(CreateWishlistFail)
        )
    )
  );

  @Effect()
  moveItemToWishlist$ = this.actions$.pipe(
    ofType<MoveItemToWishlist>(WishlistsActionTypes.MoveItemToWishlist),
    mapToPayload(),
    mergeMap(payload => {
      if (!payload.target.id) {
        return [
          new AddProductToNewWishlist({ title: payload.target.title, sku: payload.target.sku }),
          new RemoveItemFromWishlist({ wishlistId: payload.source.id, sku: payload.target.sku }),
        ];
      } else {
        return [
          new AddProductToWishlist({ wishlistId: payload.target.id, sku: payload.target.sku }),
          new RemoveItemFromWishlist({ wishlistId: payload.source.id, sku: payload.target.sku }),
        ];
      }
    })
  );

  @Effect()
  removeProductFromWishlist$ = this.actions$.pipe(
    ofType<RemoveItemFromWishlist>(WishlistsActionTypes.RemoveItemFromWishlist),
    mapToPayload(),
    mergeMap(payload =>
      this.wishlistService.removeProductFromWishlist(payload.wishlistId, payload.sku).pipe(
        map(wishlist => new RemoveItemFromWishlistSuccess({ wishlist })),
        mapErrorToAction(RemoveItemFromWishlistFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectedWishlist$ = this.store.pipe(
    select(selectRouteParam('wishlistName')),
    distinctCompareWith(this.store.pipe(select(getSelectedWishlistId))),
    map(id => new SelectWishlist({ id }))
  );

  /**
   * Trigger LoadWishlists action after LoginUserSuccess.
   */
  @Effect()
  loadWishlistsAfterLogin$ = this.store.pipe(
    select(getUserAuthorized),
    whenTruthy(),
    debounceTime(1000),
    mapTo(new LoadWishlists())
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
