import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CompareStoreModule } from '../compare-store.module';

import { addToCompare, removeFromCompare } from './compare.actions';
import { getCompareProductsSKUs, isInCompareProducts } from './compare.selectors';

describe('Compare Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompareStoreModule.forTesting('_compare'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('getCompareList', () => {
    it('should return the SKU list when queried', () => {
      store$.dispatch(addToCompare({ sku: '123' }));
      store$.dispatch(addToCompare({ sku: '456' }));

      expect(getCompareProductsSKUs(store$.state)).toMatchInlineSnapshot(`
        Array [
          "123",
          "456",
        ]
      `);
    });

    it('should not add product to compare list when product exists', () => {
      store$.dispatch(addToCompare({ sku: '123' }));
      store$.dispatch(addToCompare({ sku: '123' }));

      expect(getCompareProductsSKUs(store$.state)).toMatchInlineSnapshot(`
        Array [
          "123",
        ]
      `);
    });
  });

  describe('isInCompareList', () => {
    it('should say that SKU is in the list if it is', () => {
      store$.dispatch(addToCompare({ sku: '123' }));
      store$.dispatch(addToCompare({ sku: '456' }));

      expect(isInCompareProducts('123')(store$.state)).toBeTrue();
    });

    it("should say that SKU is not in the list if it isn't", () => {
      store$.dispatch(addToCompare({ sku: '123' }));
      store$.dispatch(addToCompare({ sku: '456' }));

      expect(isInCompareProducts('789')(store$.state)).toBeFalse();
    });

    it('should say that SKU is not in the list if SKU is removed', () => {
      store$.dispatch(addToCompare({ sku: '123' }));
      expect(isInCompareProducts('123')(store$.state)).toBeTrue();

      store$.dispatch(removeFromCompare({ sku: '123' }));
      expect(isInCompareProducts('123')(store$.state)).toBeFalse();
    });

    it('should say that SKU is in the list if another SKU is removed', () => {
      store$.dispatch(addToCompare({ sku: '123' }));
      expect(isInCompareProducts('123')(store$.state)).toBeTrue();

      store$.dispatch(removeFromCompare({ sku: '789' }));
      expect(isInCompareProducts('123')(store$.state)).toBeTrue();
    });
  });
});
