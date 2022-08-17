import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE_MOBILE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { getDeviceType } from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadMoreProducts } from './product-listing.actions';
import { ProductListingEffects } from './product-listing.effects';
import { getProductListingItemsPerPage, getProductListingViewType } from './product-listing.selectors';

describe('Product Listing Effects', () => {
  let router: Router;
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router'], [ProductListingEffects]),
        RouterTestingModule.withRoutes([{ path: 'some', children: [] }]),
        ShoppingStoreModule.forTesting('productListing'),
      ],
      providers: [
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE_MOBILE, useValue: 'list' },
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'list' },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 7 },
        provideMockStore({
          selectors: [{ selector: getDeviceType, value: 'desktop' }],
        }),
        provideStoreSnapshots(),
      ],
    });

    router = TestBed.inject(Router);
    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initializePageSize$', () => {
    it('should set page size once and only for the first incoming action', () => {
      expect(getProductListingItemsPerPage('dummy')(store$.state)).toEqual(7);
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
      store$.dispatch(loadMoreProducts({ id: { type: 'search', value: 'term' } }));

      tick(0);

      expect(store$.actionsArray()).toMatchInlineSnapshot(`Array []`);
    }));

    it('should fire all necessary actions for family page', fakeAsync(() => {
      store$.dispatch(loadMoreProducts({ id: { type: 'category', value: 'cat' } }));

      tick(0);

      expect(store$.actionsArray()).toMatchInlineSnapshot(`Array []`);
    }));
  });

  describe('action triggering with filters', () => {
    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/some?filters=param%3Dfoobar');
      tick(500);
      store$.reset();
    }));

    it('should fire all necessary actions for search page', fakeAsync(() => {
      store$.dispatch(loadMoreProducts({ id: { type: 'search', value: 'term' } }));

      tick(0);

      expect(store$.actionsArray()).toMatchInlineSnapshot(`Array []`);
      expect(store$.actionsArray()[1]).toHaveProperty('payload.filters.param', ['foobar']);
      expect(store$.actionsArray()[1]).toHaveProperty('payload.filters.searchTerm', ['term']);
    }));

    it('should fire all necessary actions for family page', fakeAsync(() => {
      store$.dispatch(loadMoreProducts({ id: { type: 'category', value: 'cat' } }));

      tick(0);

      expect(store$.actionsArray()).toMatchInlineSnapshot(`Array []`);
    }));
  });
});
