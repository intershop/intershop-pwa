import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import { addToCompare } from '../store/compare';
import { CompareStoreProviders } from '../store/compare-store.providers';

import { CompareFacade } from './compare.facade';

const moduleLoaderService = {
  ensureLoaded: () => Promise.resolve(),
  whenLoaded: <T>(_feature: string, sourceFactory: () => T) => sourceFactory(),
};

describe('Compare Facade', () => {
  let facade: CompareFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), { provide: ModuleLoaderService, useValue: moduleLoaderService }],
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
      imports: [CompareStoreProviders.forTesting('_compare'), ...CoreStoreProviders.forTesting()],
      providers: [{ provide: ModuleLoaderService, useValue: moduleLoaderService }],
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
