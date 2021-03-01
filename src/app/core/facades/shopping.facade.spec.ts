import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { addToCompare } from 'ish-core/store/shopping/compare';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';

import { ShoppingFacade } from './shopping.facade';

describe('Shopping Facade', () => {
  let facade: ShoppingFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    facade = TestBed.inject(ShoppingFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});

describe('Shopping Facade', () => {
  let facade: ShoppingFacade;
  let store$: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('compare')],
    });

    facade = TestBed.inject(ShoppingFacade);
    store$ = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('inCompareProducts$', () => {
    beforeEach(() => {
      store$.dispatch(addToCompare({ sku: '123' }));
    });

    it('should delegate value from addToCompare selector', done => {
      facade.inCompareProducts$('123').subscribe(data => {
        expect(data).toMatchInlineSnapshot(`true`);
        done();
      });
    });
  });
});
