import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { LoadMoreProducts } from './product-listing.actions';
import { ProductListingEffects } from './product-listing.effects';
import { getProductListingItemsPerPage, getProductListingViewType } from './product-listing.selectors';

describe('Product Listing Effects', () => {
  let router: Router;
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router'], [ProductListingEffects]),
        RouterTestingModule.withRoutes([{ path: 'some', component: DummyComponent }]),
        ShoppingStoreModule.forTesting('productListing'),
      ],
      providers: [
        provideStoreSnapshots(),
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 7 },
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'list' },
      ],
    });

    router = TestBed.inject(Router);
    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initializePageSize$', () => {
    it('should set page size once and only for the first incoming action', () => {
      expect(getProductListingItemsPerPage(store$.state)).toEqual(7);
    });
  });

  describe('view type from query params', () => {
    it('should set view type from query params when set', fakeAsync(() => {
      router.navigateByUrl('/some?view=grid');

      tick(500);

      expect(getProductListingViewType(store$.state)).toEqual('grid');
    }));

    it('should set default view type when not set in query params', fakeAsync(() => {
      router.navigateByUrl('/some');

      tick(500);

      expect(getProductListingViewType(store$.state)).toEqual('list');
    }));
  });

  describe('action triggering without filters', () => {
    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/some?sorting=name-asc');
      tick(500);
      store$.reset();
    }));

    it('should fire all necessary actions for search page', fakeAsync(() => {
      store$.dispatch(new LoadMoreProducts({ id: { type: 'search', value: 'term' } }));

      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        [ProductListing] Load More Products:
          id: {"type":"search","value":"term"}
        [ProductListing Internal] Load More Products For Params:
          id: {"type":"search","value":"term"}
          filters: undefined
          sorting: "name-asc"
          page: undefined
        [Shopping] Search Products:
          searchTerm: "term"
          page: undefined
          sorting: "name-asc"
        [Shopping] Load Filter for Search:
          searchTerm: "term"
      `);
    }));

    it('should fire all necessary actions for family page', fakeAsync(() => {
      store$.dispatch(new LoadMoreProducts({ id: { type: 'category', value: 'cat' } }));

      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        [ProductListing] Load More Products:
          id: {"type":"category","value":"cat"}
        [ProductListing Internal] Load More Products For Params:
          id: {"type":"category","value":"cat"}
          filters: undefined
          sorting: "name-asc"
          page: undefined
        [Shopping] Load Products for Category:
          categoryId: "cat"
          page: undefined
          sorting: "name-asc"
        [Shopping] Load Filter For Category:
          uniqueId: "cat"
      `);
    }));
  });

  describe('action triggering with filters', () => {
    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/some?filters=blablubb');
      tick(500);
      store$.reset();
    }));

    it('should fire all necessary actions for search page', fakeAsync(() => {
      store$.dispatch(new LoadMoreProducts({ id: { type: 'search', value: 'term' } }));

      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        [ProductListing] Load More Products:
          id: {"type":"search","value":"term"}
        [ProductListing Internal] Load More Products For Params:
          id: {"type":"search","value":"term"}
          filters: "blablubb"
          sorting: undefined
          page: undefined
        [Shopping] Load Products For Filter:
          id: {"type":"search","value":"term","filters":"blablubb"}
          searchParameter: "YmxhYmx1YmI="
        [Shopping] Apply Filter:
          searchParameter: "YmxhYmx1YmI="
      `);
    }));

    it('should fire all necessary actions for family page', fakeAsync(() => {
      store$.dispatch(new LoadMoreProducts({ id: { type: 'category', value: 'cat' } }));

      expect(store$.actionsArray()).toMatchInlineSnapshot(`
        [ProductListing] Load More Products:
          id: {"type":"category","value":"cat"}
        [ProductListing Internal] Load More Products For Params:
          id: {"type":"category","value":"cat"}
          filters: "blablubb"
          sorting: undefined
          page: undefined
        [Shopping] Load Products For Filter:
          id: {"type":"category","value":"cat","filters":"blablubb"}
          searchParameter: "YmxhYmx1YmI="
        [Shopping] Apply Filter:
          searchParameter: "YmxhYmx1YmI="
      `);
    }));
  });
});
