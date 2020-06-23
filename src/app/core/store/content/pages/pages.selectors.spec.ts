import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadContentPageSuccess } from './pages.actions';
import { getContentPageLoading, getSelectedContentPage } from './pages.selectors';

describe('Pages Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ContentStoreModule.forTesting('pages'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getContentPageLoading(store$.state)).toBeFalse();
    });
  });

  describe('LoadPages', () => {
    it('should select no includes when nothing was reduced', () => {
      expect(getSelectedContentPage(store$.state)).toBeUndefined();
    });

    it('should select include when it was successfully loaded', fakeAsync(() => {
      store$.dispatch(loadContentPageSuccess({ page: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] }));
      router.navigateByUrl('/any;contentPageId=dummy');
      tick(500);

      expect(getSelectedContentPage(store$.state)).toHaveProperty('id', 'dummy');
    }));
  });
});
