import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';

import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ClearRecently } from './recently.actions';
import { RecentlyEffects } from './recently.effects';
import { getMostRecentlyViewedProducts, getRecentlyViewedProducts } from './recently.selectors';

describe('Recently Selectors', () => {
  let store$: TestStore;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'product/:sku', component: DummyComponent }]),
        ngrxTesting({
          reducers: {
            configuration: configurationReducer,
            shopping: combineReducers(shoppingReducers),
          },
          effects: [RecentlyEffects],
          routerStore: true,
        }),
      ],
    });

    store$ = TestBed.get(TestStore);
    router = TestBed.get(Router);
  });

  it('should select nothing for an empty state', () => {
    expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
    expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
  });

  describe('after short shopping spree', () => {
    beforeEach(fakeAsync(() => {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(sku =>
        store$.dispatch(new LoadProductSuccess({ product: { sku } as Product }))
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
        store$.dispatch(new ClearRecently());
      });

      it('should select nothing for an empty state', () => {
        expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
        expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
      });
    });
  });

  describe('after viewing various variation', () => {
    beforeEach(fakeAsync(() => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'B' } as Product }));
      ['A1', 'A2', 'A3'].forEach(sku =>
        store$.dispatch(
          new LoadProductSuccess({
            product: { sku, type: 'VariationProduct', productMasterSKU: 'A' } as VariationProduct,
          })
        )
      );
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
        store$.dispatch(new ClearRecently());
      });

      it('should select nothing for an empty state', () => {
        expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
        expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
      });
    });
  });
});
