import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { InventoryService } from 'ish-core/services/inventory/inventory.service';
import { loadProductSuccess } from 'ish-core/store/shopping/products/products.actions';

import { productInventoryApiActions, productInventoryInternalActions } from './product-inventory.actions';
import { ProductInventoryEffects } from './product-inventory.effects';

describe('Product Inventory Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductInventoryEffects;
  let inventoryServiceMock: InventoryService;

  beforeEach(() => {
    inventoryServiceMock = mock(InventoryService);
    when(inventoryServiceMock.getProductInventory(anything())).thenCall((skus: string[]) =>
      of(skus.map(sku => ({ sku, inStock: true, availableStock: 10 })))
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: InventoryService, useFactory: () => instance(inventoryServiceMock) },
        ProductInventoryEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductInventoryEffects);
  });

  describe('loadProductInventories$', () => {
    it('should call the getProductInventory service with skus for loadProductInventory action', done => {
      const skus = ['P123'];
      const action = productInventoryInternalActions.loadProductInventory({ skus });
      actions$ = of(action);

      effects.loadProductInventories$.subscribe(() => {
        const [skusArg] = capture(inventoryServiceMock.getProductInventory).last();
        expect(skusArg).toEqual(['P123']);
        done();
      });
    });

    it('should map multiple actions to type LoadProductSuccess', () => {
      const action1 = productInventoryInternalActions.loadProductInventory({ skus: ['a', 'b'] });
      const action2 = productInventoryInternalActions.loadProductInventory({ skus: ['b', 'c'] });
      const action3 = productInventoryInternalActions.loadProductInventory({ skus: ['a', 'c', 'd'] });

      const completion = productInventoryApiActions.loadProductInventorySuccess({
        inventory: [
          { sku: 'a', inStock: true, availableStock: 10 } as ProductInventory,
          { sku: 'b', inStock: true, availableStock: 10 } as ProductInventory,
          { sku: 'c', inStock: true, availableStock: 10 } as ProductInventory,
          { sku: 'd', inStock: true, availableStock: 10 } as ProductInventory,
        ],
      });
      actions$ = hot('        -a-b-a-c--|', { a: action1, b: action2, c: action3 });
      const expected$ = cold('----------(c|)', { c: completion });

      expect(effects.loadProductInventories$).toBeObservable(expected$);
    });
  });

  describe('loadProductInventoryAfterProductSuccess$', () => {
    it('should dispatch loadProductInventory when a product is loaded successfully', () => {
      const product = { sku: 'P123' };
      const action = loadProductSuccess({ product });
      const completion = productInventoryInternalActions.loadProductInventory({ skus: ['P123'] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductInventoryAfterProductSuccess$).toBeObservable(expected$);
    });
  });
});
