import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { contentReducers } from 'ish-core/store/content/content-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './pages.actions';
import { getContentPageLoading, getSelectedContentPage } from './pages.selectors';

describe('Pages Selectors', () => {
  let store$: TestStore;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            content: combineReducers(contentReducers),
          },
          routerStore: true,
        }),
      ],
    });

    store$ = TestBed.get(TestStore);
    router = TestBed.get(Router);
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
      store$.dispatch(
        new actions.LoadContentPageSuccess({ page: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );
      router.navigateByUrl('/any;contentPageId=dummy');
      tick(500);

      expect(getSelectedContentPage(store$.state)).toHaveProperty('id', 'dummy');
    }));
  });
});
