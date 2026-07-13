import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiService } from 'ish-core/services/api/api.service';

import { WishlistSharing, WishlistSharingResponse } from '../../models/wishlist-sharing/wishlist-sharing.model';
import { WishlistData, WishlistListElementData } from '../../models/wishlist/wishlist.interface';
import { Wishlist, WishlistHeader } from '../../models/wishlist/wishlist.model';

import { WishlistService } from './wishlist.service';

describe('Wishlist Service', () => {
  let apiServiceMock: ApiService;
  let wishlistService: WishlistService;
  let appFacade: AppFacade;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    appFacade = mock(AppFacade);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    });
    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);
    when(appFacade.customerRestResource$).thenReturn(of('privatecustomers'));

    wishlistService = TestBed.inject(WishlistService);
  });

  it('should be created', () => {
    expect(wishlistService).toBeTruthy();
  });

  it("should get wishlists when 'getWishlists' is called for rest applications", done => {
    when(apiServiceMock.get(`privatecustomers/-/wishlists`)).thenReturn(
      of({
        elements: [
          {
            itemId: '1234',
            title: 'My Wishlist',
            attributes: [
              { name: 'itemsCount', value: 2 },
              { name: 'preferred', value: true },
            ],
          },
        ] as WishlistListElementData[],
      })
    );

    wishlistService.getWishlists().subscribe(data => {
      verify(apiServiceMock.get(`privatecustomers/-/wishlists`)).once();
      expect(data).toMatchInlineSnapshot(`
        [
          {
            "id": "1234",
            "itemsCount": 2,
            "preferred": true,
            "public": undefined,
            "shared": undefined,
            "title": "My Wishlist",
          },
        ]
      `);
      done();
    });
  });

  it("should get wishlists when 'getWishlists' is called for b2c applications", done => {
    when(appFacade.customerRestResource$).thenReturn(of('customers'));
    when(apiServiceMock.get(`customers/-/wishlists`)).thenReturn(
      of({
        elements: [
          {
            itemId: '1234',
            title: 'My Wishlist',
            attributes: [
              { name: 'itemsCount', value: 2 },
              { name: 'preferred', value: true },
            ],
          },
        ] as WishlistListElementData[],
      })
    );

    wishlistService.getWishlists().subscribe(data => {
      verify(apiServiceMock.get(`customers/-/wishlists`)).once();
      expect(data).toMatchInlineSnapshot(`
        [
          {
            "id": "1234",
            "itemsCount": 2,
            "preferred": true,
            "public": undefined,
            "shared": undefined,
            "title": "My Wishlist",
          },
        ]
      `);
      done();
    });
  });

  it("should get wishlists individually when 'getWishlists' returns WishlistData", done => {
    when(apiServiceMock.get(`privatecustomers/-/wishlists`)).thenReturn(
      of({
        elements: [
          { title: 'Wishlist 1', uri: 'any/wishlists/1234', preferred: false },
          { title: 'Wishlist 2', uri: 'any/wishlists/5678', preferred: true },
        ] as WishlistData[],
      })
    );
    when(apiServiceMock.get(`privatecustomers/-/wishlists/1234`)).thenReturn(
      of({ title: 'Wishlist 1', itemsCount: 2, items: [], preferred: false } as WishlistData)
    );
    when(apiServiceMock.get(`privatecustomers/-/wishlists/5678`)).thenReturn(
      of({ title: 'Wishlist 2', itemsCount: 0, items: [], preferred: true } as WishlistData)
    );

    wishlistService.getWishlists().subscribe(data => {
      verify(apiServiceMock.get(`privatecustomers/-/wishlists`)).once();
      verify(apiServiceMock.get(`privatecustomers/-/wishlists/1234`)).once();
      verify(apiServiceMock.get(`privatecustomers/-/wishlists/5678`)).once();
      expect(data).toHaveLength(2);
      done();
    });
  });

  it("should get a wishlist when 'getWishlist' is called", done => {
    const wishlistId = '1234';

    when(apiServiceMock.get(`privatecustomers/-/wishlists/${wishlistId}`)).thenReturn(
      of({ title: 'My Wishlist', itemsCount: 0, items: [], preferred: true } as WishlistData)
    );

    wishlistService.getWishlist(wishlistId).subscribe(data => {
      verify(apiServiceMock.get(`privatecustomers/-/wishlists/${wishlistId}`)).once();
      expect(data.id).toEqual(wishlistId);
      expect(data.title).toEqual('My Wishlist');
      done();
    });
  });

  it("should return an error when 'getWishlist' is called without a wishlistId", done => {
    wishlistService.getWishlist(undefined).subscribe({
      next: fail,
      error: error => {
        expect(error).toMatchInlineSnapshot(`[Error: getWishlist() called without wishlistId]`);
        done();
      },
    });
  });

  it("should create a wishlist when 'createWishlist' is called", done => {
    const wishlistId = '1234';
    const wishlistHeader: WishlistHeader = { title: 'wishlist title', preferred: false };
    when(apiServiceMock.post(`privatecustomers/-/wishlists`, anything())).thenReturn(
      of({ title: wishlistId } as WishlistData)
    );

    wishlistService.createWishlist(wishlistHeader).subscribe(data => {
      expect(wishlistId).toEqual(data.id);
      verify(apiServiceMock.post(`privatecustomers/-/wishlists`, anything())).once();
      done();
    });
  });

  it("should delete a wishlist when 'deleteWishlist' is called", done => {
    const wishlistId = '1234';

    when(apiServiceMock.delete(`privatecustomers/-/wishlists/${wishlistId}`)).thenReturn(of({}));

    wishlistService.deleteWishlist(wishlistId).subscribe(() => {
      verify(apiServiceMock.delete(`privatecustomers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });

  it("should update a wishlist when 'updateWishlist' is called", done => {
    const wishlist: Wishlist = { id: '1234', title: 'wishlist title', preferred: false };

    when(apiServiceMock.put(`privatecustomers/-/wishlists/${wishlist.id}`, anything())).thenReturn(of({ wishlist }));

    wishlistService.updateWishlist(wishlist).subscribe(data => {
      expect(wishlist.id).toEqual(data.id);
      verify(apiServiceMock.put(`privatecustomers/-/wishlists/${wishlist.id}`, anything())).once();
      done();
    });
  });

  it("should add a product to a wishlist when 'addProductToWishlist' is called", done => {
    const wishlistId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.post(`privatecustomers/-/wishlists/${wishlistId}/products/${sku}`, anything())).thenReturn(
      of({})
    );
    when(apiServiceMock.get(`privatecustomers/-/wishlists/${wishlistId}`)).thenReturn(
      of({ title: 'wishlist title' } as WishlistData)
    );

    wishlistService.addProductToWishlist(wishlistId, sku).subscribe(() => {
      verify(apiServiceMock.post(`privatecustomers/-/wishlists/${wishlistId}/products/${sku}`, anything())).once();
      verify(apiServiceMock.get(`privatecustomers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });

  it("should remove a product from a wishlist when 'removeProductToWishlist' is called", done => {
    const wishlistId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.delete(`privatecustomers/-/wishlists/${wishlistId}/products/${sku}`)).thenReturn(of({}));
    when(apiServiceMock.get(`privatecustomers/-/wishlists/${wishlistId}`)).thenReturn(
      of({ title: 'wishlist title' } as WishlistData)
    );

    wishlistService.removeProductFromWishlist(wishlistId, sku).subscribe(() => {
      verify(apiServiceMock.delete(`privatecustomers/-/wishlists/${wishlistId}/products/${sku}`)).once();
      verify(apiServiceMock.get(`privatecustomers/-/wishlists/${wishlistId}`)).once();
      done();
    });
  });

  it("should share wishlist with other users when 'shareWishlist' is called", done => {
    const wishlistId = '1234';
    const wishlistSharing: WishlistSharing = {
      recipients: 'user1@example.com,user2@example.com',
      message: 'string',
    };
    const response: WishlistSharingResponse = {
      wishlistId: '1234',
      owner: 'string',
      secureCode: 'secure123',
    };

    when(apiServiceMock.post(`privatecustomers/-/wishlists/${wishlistId}/share`, anything())).thenReturn(of(response));

    wishlistService.shareWishlist(wishlistId, wishlistSharing).subscribe(data => {
      verify(apiServiceMock.post(`privatecustomers/-/wishlists/${wishlistId}/share`, anything())).once();
      expect(data).toMatchInlineSnapshot(`
        {
          "owner": "string",
          "secureCode": "secure123",
          "wishlistId": "1234",
        }
      `);
      done();
    });
  });

  it("should unshare wishlist when 'unshareWishlist' is called", done => {
    const wishlistId = '1234';

    when(apiServiceMock.delete(`privatecustomers/-/wishlists/${wishlistId}/share`)).thenReturn(of({}));

    wishlistService.unshareWishlist(wishlistId).subscribe(() => {
      verify(apiServiceMock.delete(`privatecustomers/-/wishlists/${wishlistId}/share`)).once();
      done();
    });
  });

  it("should get shared wishlist when 'getSharedWishlist' is called", done => {
    const wishlistId = '1234';
    const owner = 'string';
    const secureCode = 'secure123';

    when(apiServiceMock.get(`wishlists/${wishlistId};owner=${owner};secureCode=${secureCode}`)).thenReturn(
      of({ title: 'wishlist title' } as WishlistData)
    );

    wishlistService.getSharedWishlist(wishlistId, owner, secureCode).subscribe(() => {
      verify(apiServiceMock.get(`wishlists/${wishlistId};owner=${owner};secureCode=${secureCode}`)).once();
      done();
    });
  });
});
