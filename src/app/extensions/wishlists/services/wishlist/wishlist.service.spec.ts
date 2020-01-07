import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { WishlistData } from '../../models/wishlist/wishlist.interface';
import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';

import { WishlistService } from './wishlist.service';

describe('Wishlist Service', () => {
  let apiServiceMock: ApiService;
  let wishlistService: WishlistService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    wishlistService = TestBed.get(WishlistService);
  });

  it('should be created', () => {
    expect(wishlistService).toBeTruthy();
  });

  it("should get wishlists when 'getWishlists' is called", done => {
    when(apiServiceMock.get(`customers/-/wishlists`)).thenReturn(of({ elements: [] }));

    wishlistService.getWishlists().subscribe(() => {
      verify(apiServiceMock.get(`customers/-/wishlists`)).once();
      done();
    });
  });

  it("should get a wishlist when 'getWishlist' is called", done => {
    const wishlistId = '1234';
    when(apiServiceMock.get(`customers/-/wishlists/${wishlistId}`)).thenReturn(
      of({ title: 'wishlist title' } as WishlistData)
    );

    wishlistService.getWishlist(wishlistId).subscribe(data => {
      expect(wishlistId).toEqual(data.id);
      verify(apiServiceMock.get(`customers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });

  it("should create a wishlist when 'createWishlist' is called", done => {
    const wishlistId = '1234';
    const wishlistHeader: WishlistHeader = { title: 'wishlist title', preferred: false };
    when(apiServiceMock.post(`customers/-/wishlists`, anything())).thenReturn(
      of({ title: wishlistId } as WishlistData)
    );

    wishlistService.createWishlist(wishlistHeader).subscribe(data => {
      expect(wishlistId).toEqual(data.id);
      verify(apiServiceMock.post(`customers/-/wishlists`, anything())).once();
      done();
    });
  });

  it("should delete a wishlist when 'deleteWishlist' is called", done => {
    const wishlistId = '1234';

    when(apiServiceMock.delete(`customers/-/wishlists/${wishlistId}`)).thenReturn(of({}));

    wishlistService.deleteWishlist(wishlistId).subscribe(() => {
      verify(apiServiceMock.delete(`customers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });

  it("should update a wishlist when 'updateWishlist' is called", done => {
    const wishlist: Wishlist = { id: '1234', title: 'wishlist title', preferred: false };

    when(apiServiceMock.put(`customers/-/wishlists/${wishlist.id}`, anything())).thenReturn(of({ wishlist }));

    wishlistService.updateWishlist(wishlist).subscribe(data => {
      expect(wishlist.id).toEqual(data.id);
      verify(apiServiceMock.put(`customers/-/wishlists/${wishlist.id}`, anything())).once();
      done();
    });
  });

  it("should add a product to a wishlist when 'addProductToWishlist' is called", done => {
    const wishlistId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.post(`customers/-/wishlists/${wishlistId}/products/${sku}`, anything())).thenReturn(of({}));
    when(apiServiceMock.get(`customers/-/wishlists/${wishlistId}`)).thenReturn(
      of({ title: 'wishlist title' } as WishlistData)
    );

    wishlistService.addProductToWishlist(wishlistId, sku).subscribe(() => {
      verify(apiServiceMock.post(`customers/-/wishlists/${wishlistId}/products/${sku}`, anything())).once();
      verify(apiServiceMock.get(`customers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });

  it("should remove a product from a wishlist when 'removeProductToWishlist' is called", done => {
    const wishlistId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.delete(`customers/-/wishlists/${wishlistId}/products/${sku}`)).thenReturn(of({}));
    when(apiServiceMock.get(`customers/-/wishlists/${wishlistId}`)).thenReturn(
      of({ title: 'wishlist title' } as WishlistData)
    );

    wishlistService.removeProductFromWishlist(wishlistId, sku).subscribe(() => {
      verify(apiServiceMock.delete(`customers/-/wishlists/${wishlistId}/products/${sku}`)).once();
      verify(apiServiceMock.get(`customers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });
});
