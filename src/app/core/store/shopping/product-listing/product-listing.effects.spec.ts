import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ProductListingEffects } from './product-listing.effects';
import { getProductListingItemsPerPage, getProductListingViewType } from './product-listing.selectors';

describe('Product Listing Effects', () => {
  let router: Router;
  let store$: TestStore;

  beforeEach(() => {
    // tslint:disable-next-line:use-component-change-detection
    @Component({ template: 'dummy' })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ...ngrxTesting(
          {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
          [ProductListingEffects]
        ),
        RouterTestingModule.withRoutes([{ path: 'some', component: DummyComponent }]),
      ],
      providers: [
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 7 },
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'list' },
      ],
    });

    router = TestBed.get(Router);
    store$ = TestBed.get(TestStore);
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
});
