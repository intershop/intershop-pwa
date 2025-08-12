import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, when } from 'ts-mockito';

import { ProductInventoryDetails } from 'ish-core/models/product-inventories/product-inventories.model';
import { InventoriesService } from 'ish-core/services/inventories/inventories.service';

import { loadProductInventory, loadProductInventorySuccess } from './product-inventories.actions';
import { ProductInventoriesEffects } from './product-inventories.effects';

describe('Product Inventories Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductInventoriesEffects;
  let inventoriesServiceMock: InventoriesService;

  beforeEach(() => {
    inventoriesServiceMock = mock(InventoriesService);
    when(inventoriesServiceMock.getProductInventory(anything())).thenCall((skus: string[]) =>
      of(skus.map(sku => ({ sku, inStock: true, availableStock: 10 })))
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: InventoriesService, useFactory: () => instance(inventoriesServiceMock) },
        ProductInventoriesEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductInventoriesEffects);
  });

  describe('loadProductInventory$', () => {
    it('should call the getProductInventory service with skus for loadProductInventory action', done => {
      const skus = ['P123'];
      const action = loadProductInventory({ skus });
      actions$ = of(action);

      effects.loadProductInventory$.subscribe(() => {
        const [skusArg] = capture(inventoriesServiceMock.getProductInventory).last();
        expect(skusArg).toEqual(['P123']);
        done();
      });
    });

    it('should map multiple actions to type LoadProductSuccess', () => {
      const action1 = loadProductInventory({ skus: ['a', 'b'] });
      const action2 = loadProductInventory({ skus: ['b', 'c'] });
      const action3 = loadProductInventory({ skus: ['a', 'c', 'd'] });

      const completion = loadProductInventorySuccess({
        inventory: [
          { sku: 'a', inStock: true, availableStock: 10 } as ProductInventoryDetails,
          { sku: 'b', inStock: true, availableStock: 10 } as ProductInventoryDetails,
          { sku: 'c', inStock: true, availableStock: 10 } as ProductInventoryDetails,
          { sku: 'd', inStock: true, availableStock: 10 } as ProductInventoryDetails,
        ],
      });
      actions$ = hot('        -a-b-a-c--|', { a: action1, b: action2, c: action3 });
      const expected$ = cold('----------(c|)', { c: completion });

      expect(effects.loadProductInventory$).toBeObservable(expected$);
    });
  });
});
