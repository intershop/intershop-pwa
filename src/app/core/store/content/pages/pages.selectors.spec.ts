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

  describe('getSelectedContentPageBreadcrumbData', () => {
    const tree1 = { contentPageId: '1', path: ['1'], name: '1' } as ContentPageTreeElement;
    const tree2 = { contentPageId: '1.1', path: ['1', '1.1'], name: '1.1' } as ContentPageTreeElement;

    beforeEach(() => {
      store$.dispatch(
        loadContentPageSuccess({
          page: { id: '1.1', displayName: 'page-1.1' } as ContentPageletEntryPoint,
          pagelets: [],
        })
      );
      store$.dispatch(
        loadContentPageSuccess({ page: { id: '1', displayName: 'page-1' } as ContentPageletEntryPoint, pagelets: [] })
      );
    });

    it('should return undefined, if selected content page is not part of a page tree', fakeAsync(() => {
      router.navigateByUrl('/any;contentPageId=1.1');
      tick(500);
      expect(getBreadcrumbForContentPage(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "page-1.1",
          },
        ]
      `);
    }));

    it('should return BreadcrumbData, if selected content page is part of a page tree', fakeAsync(() => {
      store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2]) }));
      router.navigateByUrl('/any;contentPageId=1');
      tick(500);
      expect(getBreadcrumbForContentPage(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "1",
            "link": undefined,
          },
        ]
      `);
    }));

    it('should return BreadcrumbData, if selected content page is part of a page tree', fakeAsync(() => {
      store$.dispatch(loadContentPageTreeSuccess({ pagetree: pageTree([tree1, tree2]) }));
      router.navigateByUrl('/any;contentPageId=1.1');
      tick(500);
      expect(getBreadcrumbForContentPage(store$.state)).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "1",
            "link": "/1-pg1",
          },
          Object {
            "key": "1.1",
            "link": undefined,
          },
        ]
      `);
    }));
  });
});
