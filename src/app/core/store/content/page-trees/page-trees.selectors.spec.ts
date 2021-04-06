import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { getContentPageTreesLoading } from './page-trees.selectors';

describe('Page Trees Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ContentStoreModule.forTesting('trees'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getContentPageTreesLoading(store$.state)).toBeFalse();
    });
  });
});
