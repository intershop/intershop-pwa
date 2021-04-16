import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentPageletTreeElement } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { loadContentPageTreeSuccess } from './page-trees.actions';
import { getContentPageTreeView, getSelectedContentPageTreeView } from './page-trees.selectors';

describe('Page Trees Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;
  let tree1: ContentPageletTreeElement;
  let tree2: ContentPageletTreeElement;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    tree1 = { contentPageId: '1', path: ['1'] } as ContentPageletTreeElement;
    tree2 = { contentPageId: '1.1', path: ['1', '1.1'] } as ContentPageletTreeElement;

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ContentStoreModule.forTesting('trees'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'page/:contentPageId', component: DummyComponent }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('with empty state', () => {
    it('should not select any selected page tree when used', () => {
      expect(getSelectedContentPageTreeView(store$.state)).toBeUndefined();
      expect(getContentPageTreeView(tree1.contentPageId)(store$.state)).toBeUndefined();
    });
  });

  describe('state contains page tree', () => {
    beforeEach(() => store$.dispatch(loadContentPageTreeSuccess({ tree: pageTree([tree1, tree2]) })));

    describe('with content page route', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl(`page/${tree1.contentPageId}`);
        tick(500);
      }));

      it('should select page tree view when used', () => {
        expect(getSelectedContentPageTreeView(store$.state).contentPageId).toEqual(tree1.contentPageId);
        expect(getSelectedContentPageTreeView(store$.state)).toMatchInlineSnapshot(`
          Object {
            "children": Array [
              "1.1",
            ],
            "contentPageId": "1",
            "path": Array [
              "1",
            ],
          }
        `);
      });
    });

    describe('with no page route', () => {
      it('should select content page tree of given uniqueId', () => {
        expect(getContentPageTreeView(tree2.contentPageId)(store$.state).contentPageId).toEqual(tree2.contentPageId);
        expect(getContentPageTreeView(tree2.contentPageId)(store$.state)).toMatchInlineSnapshot(`
          Object {
            "children": Array [],
            "contentPageId": "1.1",
            "path": Array [
              "1",
              "1.1",
            ],
          }
        `);
      });
    });
  });
});
