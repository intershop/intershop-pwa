import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { concatMap, first, map, switchMap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { WishlistSharing, WishlistSharingResponse } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { WishlistData } from '../../models/wishlist/wishlist.interface';
import { WishlistMapper } from '../../models/wishlist/wishlist.mapper';
import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private apiService: ApiService, private wishlistMapper: WishlistMapper, private appFacade: AppFacade) {}

  /**
   * Gets a list of wishlists for the current user.
   *
   * @returns           The customer's wishlists.
   */
  getWishlists(): Observable<Wishlist[]> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.get(`${restResource}/-/wishlists`).pipe(
          unpackEnvelope<WishlistData>(),
          map(wishlistData => wishlistData.map(data => this.getWishlist(this.wishlistMapper.fromDataToId(data)))),
          switchMap(obsArray => (obsArray.length ? forkJoin(obsArray) : of([])))
        )
      )
    );
  }

  /**
   * Gets a wishlist of the given id for the current user.
   *
   * @param wishlistId  The wishlist id.
   * @returns           The wishlist.
   */
  private getWishlist(wishlistId: string): Observable<Wishlist> {
    if (!wishlistId) {
      return throwError(() => new Error('getWishlist() called without wishlistId'));
    }
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .get<WishlistData>(`${restResource}/-/wishlists/${this.apiService.encodeResourceId(wishlistId)}`)
          .pipe(map(wishlistData => this.wishlistMapper.fromData(wishlistData, wishlistId)))
      )
    );
  }

  /**
   * Creates a wishlists for the current user.
   *
   * @param wishlistDetails   The wishlist data.
   * @returns                 The created wishlist.
   */
  createWishlist(wishlistData: WishlistHeader): Observable<Wishlist> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .post(`${restResource}/-/wishlists`, wishlistData)
          .pipe(map((response: WishlistData) => this.wishlistMapper.fromData(wishlistData, response.title)))
      )
    );
  }

  /**
   * Deletes a wishlist of the given id.
   *
   * @param wishlistId   The wishlist id.
   * @returns            The wishlist.
   */
  deleteWishlist(wishlistId: string): Observable<void> {
    if (!wishlistId) {
      return throwError(() => new Error('deleteWishlist() called without wishlistId'));
    }
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.delete<void>(`${restResource}/-/wishlists/${this.apiService.encodeResourceId(wishlistId)}`)
      )
    );
  }

  /**
   * Updates a wishlist of the given id.
   *
   * @param wishlist   The wishlist to be updated.
   * @returns          The updated wishlist.
   */
  updateWishlist(wishlist: Wishlist): Observable<Wishlist> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .put(`${restResource}/-/wishlists/${this.apiService.encodeResourceId(wishlist.id)}`, wishlist)
          .pipe(map((response: Wishlist) => this.wishlistMapper.fromUpdate(response, wishlist.id)))
      )
    );
  }

  /**
   * Adds a product to the wishlist with the given id and reloads the wishlist.
   *
   * @param wishlist Id   The wishlist id.
   * @param sku           The product sku.
   * @param quantity      The product quantity (default = 1).
   * @returns             The changed wishlist.
   */
  addProductToWishlist(wishlistId: string, sku: string, quantity = 1): Observable<Wishlist> {
    if (!wishlistId) {
      return throwError(() => new Error('addProductToWishlist() called without wishlistId'));
    }
    if (!sku) {
      return throwError(() => new Error('addProductToWishlist() called without sku'));
    }
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .post(
            `${restResource}/-/wishlists/${this.apiService.encodeResourceId(
              wishlistId
            )}/products/${this.apiService.encodeResourceId(sku)}`,
            { quantity }
          )
          .pipe(concatMap(() => this.getWishlist(wishlistId)))
      )
    );
  }

  /**
   * Removes a product from the wishlist with the given id. Returns an error observable if parameters are falsy.
   *
   * @param wishlist Id   The wishlist id.
   * @param sku           The product sku.
   * @returns             The changed wishlist.
   */
  removeProductFromWishlist(wishlistId: string, sku: string): Observable<Wishlist> {
    if (!wishlistId) {
      return throwError(() => new Error('removeProductFromWishlist() called without wishlistId'));
    }
    if (!sku) {
      return throwError(() => new Error('removeProductFromWishlist() called without sku'));
    }
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .delete(
            `${restResource}/-/wishlists/${this.apiService.encodeResourceId(
              wishlistId
            )}/products/${this.apiService.encodeResourceId(sku)}`
          )
          .pipe(concatMap(() => this.getWishlist(wishlistId)))
      )
    );
  }

  /**
   * Shares the wishlist with other users (a comma separated list of email addresses)
   *
   * @param wishlistId       The wishlist id.
   * @param wishlistSharing  The wishlist sharing data.
   * @returns                The wishlist sharing response data with the secureCode which should be used to access the shared wishlist.
   */
  shareWishlist(wishlistId: string, wishlistSharing: WishlistSharing): Observable<WishlistSharingResponse> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .post(`${restResource}/-/wishlists/${wishlistId}/share`, wishlistSharing)
          .pipe(map((response: WishlistSharingResponse) => response))
      )
    );
  }

  /**
   * Unshare the wishlist and invalidate all generated secureCodes.
   *
   * @param wishlistId  The wishlist id.
   */
  unshareWishlist(wishlistId: string): Observable<void> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource => this.apiService.delete<void>(`${restResource}/-/wishlists/${wishlistId}/share`))
    );
  }

  /**
   * Gets the shared wishlist using the secureCode to check access.
   *
   * @param wishlistId  The wishlist id.
   * @param owner       The wishlist owner.
   * @param secureCode  The secureCode.
   * @returns           The wishlist.
   */
  getSharedWishlist(wishlistId: string, owner: string, secureCode: string): Observable<Wishlist> {
    return this.apiService
      .get<WishlistData>(`wishlists/${wishlistId};owner=${owner};secureCode=${secureCode}`)
      .pipe(map(wishlist => this.wishlistMapper.fromData(wishlist, wishlistId)));
  }
}
