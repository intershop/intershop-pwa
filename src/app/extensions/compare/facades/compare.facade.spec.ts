import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { addToCompare } from '../store/compare';
import { CompareStoreModule } from '../store/compare-store.module';

import { CompareFacade } from './compare.facade';

describe('Compare Facade', () => {
  let facade: CompareFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    facade = TestBed.inject(CompareFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});

describe('Compare Facade', () => {
  let facade: CompareFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompareStoreModule.forTesting('_compare'), CoreStoreModule.forTesting()],
    });

    facade = TestBed.inject(CompareFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('inCompareProducts$', () => {
    beforeEach(() => {
      store.dispatch(addToCompare({ sku: '123' }));
    });

    it('should delegate value from addToCompare selector', done => {
      facade.inCompareProducts$('123').subscribe(data => {
        expect(data).toMatchInlineSnapshot(`true`);
        done();
      });
    });
  });
});
