import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { debounceTime, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { businessError } from 'ish-core/store/core/error';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { WishlistSharing, WishlistSharingResponse } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';
import { WishlistService } from '../../services/wishlist/wishlist.service';

import {
  addProductToNewWishlist,
  addProductToWishlist,
  addProductToWishlistFail,
  addProductToWishlistSuccess,
  createWishlist,
  createWishlistFail,
  createWishlistSuccess,
  deleteWishlist,
  deleteWishlistFail,
  deleteWishlistSuccess,
  loadWishlists,
  loadWishlistsFail,
  loadWishlistsSuccess,
  moveItemToWishlist,
  removeItemFromWishlist,
  removeItemFromWishlistFail,
  removeItemFromWishlistSuccess,
  selectWishlist,
  updateWishlist,
  updateWishlistFail,
  updateWishlistSuccess,
  wishlistActions,
  wishlistApiActions,
} from './wishlist.actions';
import { getSelectedWishlistDetails, getSelectedWishlistId, getWishlistDetails } from './wishlist.selectors';

@Injectable()
export class WishlistEffects {
  constructor(
    private actions$: Actions,
    private wishlistService: WishlistService,
    private store: Store,
    private translateService: TranslateService,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  loadWishlists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWishlists),
      concatLatestFrom(() => this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      switchMap(() =>
        this.wishlistService.getWishlists().pipe(
          map(wishlists => loadWishlistsSuccess({ wishlists })),
          mapErrorToAction(loadWishlistsFail)
        )
      )
    )
  );

  createWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createWishlist),
      mapToPayloadProperty('wishlist'),
      mergeMap((wishlistData: WishlistHeader) =>
        this.wishlistService.createWishlist(wishlistData).pipe(
          mergeMap(wishlist => [
            createWishlistSuccess({ wishlist }),
            displaySuccessMessage({
              message: 'account.wishlists.new_wishlist.confirmation',
              messageParams: { 0: wishlist.title },
            }),
          ]),
          mapErrorToAction(createWishlistFail)
        )
      )
    )
  );

  deleteWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteWishlist),
      mapToPayloadProperty('wishlistId'),
      mergeMap(wishlistId => this.store.pipe(select(getWishlistDetails(wishlistId)))),
      whenTruthy(),
      map(wishlist => ({ wishlistId: wishlist.id, title: wishlist.title })),
      mergeMap(({ wishlistId, title }) =>
        this.wishlistService.deleteWishlist(wishlistId).pipe(
          mergeMap(() => [
            deleteWishlistSuccess({ wishlistId }),
            displaySuccessMessage({
              message: 'account.wishlists.delete_wishlist.confirmation',
              messageParams: { 0: title },
            }),
          ]),
          mapErrorToAction(deleteWishlistFail)
        )
      )
    )
  );

  updateWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateWishlist),
      mapToPayloadProperty('wishlist'),
      mergeMap((newWishlist: Wishlist) =>
        this.wishlistService.updateWishlist(newWishlist).pipe(
          mergeMap(wishlist => [
            updateWishlistSuccess({ wishlist }),
            displaySuccessMessage({
              message: 'account.wishlists.edit_wishlist.confirmation',
              messageParams: { 0: wishlist.title },
            }),
          ]),
          mapErrorToAction(updateWishlistFail)
        )
      )
    )
  );

  /**
   * Reload Wishlists after a creation or update to ensure integrity with server concerning the preferred wishlist
   */
  reloadWishlists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateWishlistSuccess, createWishlistSuccess),
      mapToPayloadProperty('wishlist'),
      filter(wishlist => wishlist?.preferred),
      map(() => loadWishlists())
    )
  );

  addProductToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToWishlist),
      mapToPayload(),
      mergeMap(payload =>
        this.wishlistService.addProductToWishlist(payload.wishlistId, payload.sku, payload.quantity).pipe(
          map(wishlist => addProductToWishlistSuccess({ wishlist })),
          mapErrorToAction(addProductToWishlistFail)
        )
      )
    )
  );

  addProductToNewWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToNewWishlist),
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
              createWishlistSuccess({ wishlist }),
              addProductToWishlist({ wishlistId: wishlist.id, sku: payload.sku }),
              selectWishlist({ wishlistId: wishlist.id }),
            ]),
            mapErrorToAction(createWishlistFail)
          )
      )
    )
  );

  moveItemToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveItemToWishlist),
      mapToPayload(),
      mergeMap(payload => {
        if (!payload.target.id) {
          return [
            addProductToNewWishlist({ title: payload.target.title, sku: payload.target.sku }),
            removeItemFromWishlist({ wishlistId: payload.source.id, sku: payload.target.sku }),
          ];
        } else {
          return [
            addProductToWishlist({ wishlistId: payload.target.id, sku: payload.target.sku }),
            removeItemFromWishlist({ wishlistId: payload.source.id, sku: payload.target.sku }),
          ];
        }
      })
    )
  );

  removeProductFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeItemFromWishlist),
      mapToPayload(),
      mergeMap(payload =>
        this.wishlistService.removeProductFromWishlist(payload.wishlistId, payload.sku).pipe(
          map(wishlist => removeItemFromWishlistSuccess({ wishlist })),
          mapErrorToAction(removeItemFromWishlistFail)
        )
      )
    )
  );

  routeListenerForSelectedWishlist$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('wishlistName')),
      distinctCompareWith(this.store.pipe(select(getSelectedWishlistId))),
      map(id => selectWishlist({ wishlistId: id }))
    )
  );

  /**
   * Trigger LoadWishlists action after LoginUserSuccess.
   */
  loadWishlistsAfterLogin$ = createEffect(() =>
    this.store.pipe(
      select(getUserAuthorized),
      whenTruthy(),
      debounceTime(1000),
      map(() => loadWishlists())
    )
  );

  setWishlistBreadcrumb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMap(() =>
        this.store.pipe(
          ofUrl(/^\/account\/wishlists\/.*/),
          select(getSelectedWishlistDetails),
          whenTruthy(),
          map(wishlist =>
            setBreadcrumbData({
              breadcrumbData: [
                { key: 'account.wishlists.breadcrumb_link', link: '/account/wishlists' },
                { text: wishlist.title },
              ],
            })
          )
        )
      )
    )
  );

  shareWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wishlistActions.shareWishlist),
      mapToPayload(),
      concatLatestFrom(payload => this.store.pipe(select(getWishlistDetails(payload.wishlistId)))),
      mergeMap(([payload, wishlist]) =>
        this.wishlistService.shareWishlist(payload.wishlistId, payload.wishlistSharing).pipe(
          switchMap(response => {
            this.sendEmail(payload.wishlistSharing, response, wishlist?.title);
            return of(wishlistApiActions.shareWishlistSuccess({ wishlistSharingResponse: response }));
          }),
          mapErrorToAction(wishlistApiActions.shareWishlistFail)
        )
      )
    )
  );

  unshareWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wishlistActions.unshareWishlist),
      mapToPayloadProperty('wishlistId'),
      mergeMap(wishlistId =>
        this.wishlistService.unshareWishlist(wishlistId).pipe(
          map(() => wishlistApiActions.unshareWishlistSuccess({ wishlistId })),
          mapErrorToAction(wishlistApiActions.unshareWishlistFail)
        )
      )
    )
  );

  loadSharedWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wishlistActions.loadSharedWishlist),
      mapToPayload(),
      mergeMap(payload =>
        this.wishlistService.getSharedWishlist(payload.wishlistId, payload.owner, payload.secureCode).pipe(
          map(wishlist => wishlistApiActions.loadSharedWishlistSuccess({ wishlist })),
          mapErrorToAction(wishlistApiActions.loadSharedWishlistFail)
        )
      )
    )
  );

  loadSharedWishlistFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(wishlistApiActions.loadSharedWishlistFail),
      map(() => businessError({ error: 'account.wishlists.shared_wishlist.error' }))
    )
  );

  private sendEmail(wishlistSharing: WishlistSharing, wishlistResponse: WishlistSharingResponse, title: string) {
    const emailSubject = this.translateService.instant('email.wishlist_sharing.heading');
    const defaultText = this.translateService.instant('email.wishlist_sharing.text');

    const baseUrl = `${location.origin}${this.baseHref}`;
    const emailBody = `${wishlistSharing.message || defaultText} ${title}\n${baseUrl}/wishlists/${
      wishlistResponse.wishlistId
    }?owner=${wishlistResponse.owner}&secureCode=${wishlistResponse.secureCode}`;

    const mailtoLink = `mailto:${wishlistSharing.recipients}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoLink);
  }
}
