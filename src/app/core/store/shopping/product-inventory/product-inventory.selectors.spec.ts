import { TestBed, fakeAsync } from '@angular/core/testing';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { productInventoryApiActions } from './product-inventory.actions';
import { getProductInventory, getProductInventoryEntities } from './product-inventory.selectors';

describe('Product Inventory Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['serverConfig']), ShoppingStoreModule.forTesting('productInventory')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any product inventory when used', () => {
      expect(getProductInventoryEntities(store$.state)).toBeEmpty();
      expect(getProductInventory('sku')(store$.state)).toBeUndefined();
    });
  });

  describe('with LoadProductInventorySuccess state', () => {
    const inventoryDetails: ProductInventory = { sku: 'sku' } as ProductInventory;
    beforeEach(() => {
      store$.dispatch(productInventoryApiActions.loadProductInventorySuccess({ inventory: [inventoryDetails] }));
    });
    it('should add the product inventory to the state', fakeAsync(() => {
      expect(getProductInventoryEntities(store$.state)).toMatchObject({ sku: inventoryDetails });
      expect(getProductInventory('sku')(store$.state)).toEqual(inventoryDetails);
    }));
  });
});
