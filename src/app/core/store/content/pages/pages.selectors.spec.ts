import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { loadContentPageTreeSuccess } from 'ish-core/store/content/page-tree';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { pageTree } from 'ish-core/utils/dev/test-data-utils';

import { loadContentPageSuccess } from './pages.actions';
import { getBreadcrumbForContentPage, getContentPageLoading, getSelectedContentPage } from './pages.selectors';

describe('Pages Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ContentStoreModule.forTesting('pages', 'pagetree'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
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

  describe('getBreadcrumbForContentPage', () => {
    const tree1 = { contentPageId: '1', path: ['1'], name: 'Page 1' } as ContentPageTreeElement;
    const tree2 = { contentPageId: '1.1', path: ['1', '1.1'], name: 'Page 1.1' } as ContentPageTreeElement;
    const tree3 = { contentPageId: '1.1.1', path: ['1', '1.1', '1.1.1'], name: 'Page 1.1.1' } as ContentPageTreeElement;
    const tree4 = { contentPageId: '1.1.2', path: ['1', '1.1', '1.1.2'], name: 'Page 1.1.2' } as ContentPageTreeElement;

    beforeEach(() => {
      store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2, tree3, tree4]) }));
    });

    it('should return just the page name, if no rootId is given', fakeAsync(() => {
      store$.dispatch(
        loadContentPageSuccess({
          page: { id: '1.1', displayName: 'Page 1.1' } as ContentPageletEntryPoint,
          pagelets: [],
        })
      );
      router.navigateByUrl('/any;contentPageId=1.1');
      tick(500);
      expect(getBreadcrumbForContentPage(undefined)(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "Page 1.1",
          },
        ]
      `);
    }));

    it('should return just the page name, if a rootId, that is not in the path, is given', fakeAsync(() => {
      store$.dispatch(
        loadContentPageSuccess({
          page: { id: '1.1', displayName: 'Page 1.1' } as ContentPageletEntryPoint,
          pagelets: [],
        })
      );
      router.navigateByUrl('/any;contentPageId=1.1');
      tick(500);
      expect(getBreadcrumbForContentPage('1.1.2')(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "Page 1.1",
          },
        ]
      `);
    }));

    it('should return complete BreadcrumbData, if "COMPLETE" is given as rootId if rootId is not known', fakeAsync(() => {
      store$.dispatch(
        loadContentPageSuccess({
          page: { id: '1.1', displayName: 'Page 1.1' } as ContentPageletEntryPoint,
          pagelets: [],
        })
      );
      router.navigateByUrl('/any;contentPageId=1.1');
      tick(500);
      expect(getBreadcrumbForContentPage('COMPLETE')(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "Page 1",
            "link": "/page-1-pg1",
          },
          Object {
            "key": "Page 1.1",
            "link": undefined,
          },
        ]
      `);
    }));

    it('should return complete BreadcrumbData, if root rootId is given', fakeAsync(() => {
      store$.dispatch(
        loadContentPageSuccess({
          page: { id: '1.1.1', displayName: 'Page 1.1.1' } as ContentPageletEntryPoint,
          pagelets: [],
        })
      );
      router.navigateByUrl('/any;contentPageId=1.1.1');
      tick(500);
      expect(getBreadcrumbForContentPage('1')(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "Page 1",
            "link": "/page-1-pg1",
          },
          Object {
            "key": "Page 1.1",
            "link": "/page-1/page-1.1-pg1.1",
          },
          Object {
            "key": "Page 1.1.1",
            "link": undefined,
          },
        ]
      `);
    }));

    it('should return partial BreadcrumbData, if not root is given as rootId', fakeAsync(() => {
      store$.dispatch(
        loadContentPageSuccess({
          page: { id: '1.1.1', displayName: 'Page 1.1.1' } as ContentPageletEntryPoint,
          pagelets: [],
        })
      );
      router.navigateByUrl('/any;contentPageId=1.1.1');
      tick(500);
      expect(getBreadcrumbForContentPage('1.1')(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "Page 1.1",
            "link": "/page-1/page-1.1-pg1.1",
          },
          Object {
            "key": "Page 1.1.1",
            "link": undefined,
          },
        ]
      `);
    }));
  });
});
