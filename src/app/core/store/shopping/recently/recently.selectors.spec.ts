import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { flatten } from 'lodash-es';

import { Product, VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadProductSuccess, loadProductVariationsSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { clearRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';
import { getMostRecentlyViewedProducts, getRecentlyViewedProducts } from './recently.selectors';

describe('Recently Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router', 'configuration'], [RecentlyEffects]),
        RouterTestingModule.withRoutes([{ path: 'product/:sku', component: DummyComponent }]),
        ShoppingStoreModule.forTesting('recently', 'categories', 'products'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  it('should select nothing for an empty state', () => {
    expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
    expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
  });

  describe('after short shopping spree', () => {
    beforeEach(fakeAsync(() => {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(sku =>
        store$.dispatch(loadProductSuccess({ product: { sku } as Product }))
      );
      ['A', 'B', 'F', 'C', 'A', 'D', 'E', 'D', 'A', 'B', 'A'].forEach(sku => {
        router.navigateByUrl('/product/' + sku);
        tick(500);
      });
    }));

    it('should have collected data for display on pages', () => {
      const viewed = ['A', 'B', 'D', 'E', 'C', 'F'];
      expect(getRecentlyViewedProducts(store$.state)).toEqual(viewed);
      const filtered = ['B', 'D', 'E', 'C'];
      expect(getMostRecentlyViewedProducts(store$.state)).toEqual(filtered);
    });

    describe('when clearing the state', () => {
      beforeEach(() => {
        store$.dispatch(clearRecently());
      });

      it('should select nothing for an empty state', () => {
        expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
        expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
      });
    });
  });

  describe('after viewing various variation', () => {
    beforeEach(fakeAsync(() => {
      flatten([
        loadProductSuccess({ product: { sku: 'A', type: 'VariationProductMaster' } as VariationProductMaster }),
        loadProductSuccess({ product: { sku: 'B' } as Product }),
        ['A1', 'A2', 'A3'].map(sku =>
          loadProductSuccess({
            product: { sku, type: 'VariationProduct', productMasterSKU: 'A' } as VariationProduct,
          })
        ),
        loadProductVariationsSuccess({ sku: 'A', variations: ['A1', 'A2', 'A3'], defaultVariation: 'A1' }),
      ]).forEach(a => store$.dispatch(a));

      ['A1', 'A2', 'B', 'A1', 'A3'].forEach(sku => {
        router.navigateByUrl('/product/' + sku);
        tick(500);
      });
    }));

    it('should have collected data for display on pages', () => {
      const viewed = ['A3', 'B'];
      expect(getRecentlyViewedProducts(store$.state)).toEqual(viewed);
      const filtered = ['B'];
      expect(getMostRecentlyViewedProducts(store$.state)).toEqual(filtered);
    });

    describe('when clearing the state', () => {
      beforeEach(() => {
        store$.dispatch(clearRecently());
      });

      it('should select nothing for an empty state', () => {
        expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
        expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
      });
    });
  });
});
