import { TestBed, fakeAsync } from '@angular/core/testing';

import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadProductPricesSuccess } from '.';
import { getProductPrice } from './product-prices.selectors';

describe('Product Prices Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['serverConfig']), ShoppingStoreModule.forTesting('productPrices')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any product price when used', () => {
      expect(getProductPrice('sku')(store$.state)).toBeUndefined();
    });
  });

  describe('with LoadProductPriceSuccess state', () => {
    const priceDetails: ProductPriceDetails = { sku: 'sku' } as ProductPriceDetails;
    beforeEach(() => {
      store$.dispatch(loadProductPricesSuccess({ prices: [priceDetails] }));
    });
    it('should add the product price to the state', fakeAsync(() => {
      expect(getProductPrice('sku')(store$.state)).toEqual(priceDetails);
    }));
  });
});
