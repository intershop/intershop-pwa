import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Wishlist } from '../models/wishlist/wishlist.model';
import { getAllWishlists, getAllWishlistsItemsSkus, wishlistActions } from '../store/wishlist';
import { initialState, wishlistsAdapter } from '../store/wishlist/wishlist.reducer';

import { WishlistsFacade } from './wishlists.facade';

describe('Wishlists Facade', () => {
  let facade: WishlistsFacade;
  let store: MockStore;

  const loadedWishlist: Wishlist = {
    id: 'loaded',
    title: 'loaded wishlist',
    preferred: false,
    itemsCount: 1,
    items: [{ sku: 'sku1', id: 'item1', creationDate: 1, desiredQuantity: { value: 1 } }],
  };
  const headerWishlist: Wishlist = { id: 'header', title: 'header only wishlist', preferred: false, itemsCount: 2 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    facade = TestBed.inject(WishlistsFacade);
    store = TestBed.inject(MockStore);
    store.overrideSelector(getAllWishlistsItemsSkus, ['sku1', 'sku2']);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('wishlistItemsSkus$', () => {
    it('should return the unique SKUs of all wishlist items', done => {
      store.overrideSelector(getAllWishlists, [loadedWishlist]);
      facade.wishlistItemsSkus$().subscribe(skus => {
        expect(skus).toEqual(['sku1', 'sku2']);
        done();
      });
    });

    it('should trigger loading the details of wishlists without loaded items', done => {
      store.overrideSelector(getAllWishlists, [loadedWishlist, headerWishlist]);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.wishlistItemsSkus$().subscribe(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(wishlistActions.loadWishlistDetails({ wishlistIds: ['header'] }));
        done();
      });
    });

    it('should not trigger loading when the details of all wishlists are already loaded', done => {
      store.overrideSelector(getAllWishlists, [loadedWishlist]);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.wishlistItemsSkus$().subscribe(() => {
        expect(dispatchSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should emit an empty array and not trigger loading when there are no wishlists', done => {
      store.overrideSelector(getAllWishlists, []);
      store.overrideSelector(getAllWishlistsItemsSkus, []);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.wishlistItemsSkus$().subscribe(skus => {
        expect(skus).toBeEmpty();
        expect(dispatchSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('wishlistItemsSkus$ with a wishlistId', () => {
    const setWishlists = (wishlists: Wishlist[]) => {
      store.setState({ wishlists: { wishlists: wishlistsAdapter.setAll(wishlists, initialState) } });
    };

    it('should return the unique SKUs of the given wishlist only', done => {
      setWishlists([loadedWishlist, headerWishlist]);
      facade.wishlistItemsSkus$('loaded').subscribe(skus => {
        expect(skus).toEqual(['sku1']);
        done();
      });
    });

    it('should trigger loading when the given wishlist has no loaded items', done => {
      setWishlists([headerWishlist]);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.wishlistItemsSkus$('header').subscribe(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(wishlistActions.loadWishlistDetails({ wishlistIds: ['header'] }));
        done();
      });
    });

    it('should not trigger loading when the given wishlist is already loaded', done => {
      setWishlists([loadedWishlist]);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.wishlistItemsSkus$('loaded').subscribe(() => {
        expect(dispatchSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
