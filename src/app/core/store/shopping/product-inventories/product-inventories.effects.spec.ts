import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { InventoryService } from 'ish-core/services/inventory/inventory.service';

import { productInventoriesApiActions, productInventoriesInternalActions } from './product-inventories.actions';
import { ProductInventoriesEffects } from './product-inventories.effects';

describe('Product Inventories Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductInventoriesEffects;
  let inventoriesServiceMock: InventoryService;

  beforeEach(() => {
    inventoriesServiceMock = mock(InventoryService);
    when(inventoriesServiceMock.getProductInventory(anything())).thenCall((skus: string[]) =>
      of(skus.map(sku => ({ sku, inStock: true, availableStock: 10 })))
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: InventoryService, useFactory: () => instance(inventoriesServiceMock) },
        ProductInventoriesEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductInventoriesEffects);
  });

  describe('loadProductInventories$', () => {
    it('should call the getProductInventory service with skus for loadProductInventory action', done => {
      const skus = ['P123'];
      const action = productInventoriesInternalActions.loadProductInventories({ skus });
      actions$ = of(action);

      effects.loadProductInventories$.subscribe(() => {
        const [skusArg] = capture(inventoriesServiceMock.getProductInventory).last();
        expect(skusArg).toEqual(['P123']);
        done();
      });
    });

    it('should map multiple actions to type LoadProductSuccess', () => {
      const action1 = productInventoriesInternalActions.loadProductInventories({ skus: ['a', 'b'] });
      const action2 = productInventoriesInternalActions.loadProductInventories({ skus: ['b', 'c'] });
      const action3 = productInventoriesInternalActions.loadProductInventories({ skus: ['a', 'c', 'd'] });

      const completion = productInventoriesApiActions.loadProductInventoriesSuccess({
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
});
