import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ContentPageletTreeData } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.interface';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';
import { PageTreesEffects } from './page-trees.effects';

describe('Page Trees Effects', () => {
  let actions$: Observable<Action>;
  let effects: PageTreesEffects;
  let cmsServiceMock: CMSService;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'page/:contentPageId', component: DummyComponent }]),
      ],
      providers: [
        PageTreesEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });

    effects = TestBed.inject(PageTreesEffects);
    router = TestBed.inject(Router);
  });

  describe('loadContentPageTree$', () => {
    it('should send fail action when loading action via service is unsuccessful', done => {
      when(cmsServiceMock.getContentPageTree('dummy')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = of(loadContentPageTree({ contentPageId: 'dummy' }));

      effects.loadContentPageTree$.subscribe(action => {
        verify(cmsServiceMock.getContentPageTree('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Page API] Load Content Page Tree Fail:
            error: {"name":"HttpErrorResponse","message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(cmsServiceMock.getContentPageTree('dummy')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ contentPageId: 'dummy' }) });

      expect(effects.loadContentPageTree$).toBeObservable(
        cold('a-a-a-a', { a: loadContentPageTreeFail({ error: makeHttpError({ message: 'ERROR' }) }) })
      );
    });

    it('should load page tree again when actual tree does not contain navigation root', () => {
      const tree = { parent: { itemId: 'parent' }, path: [{ itemId: 'parent' }] } as ContentPageletTreeData;
      when(cmsServiceMock.getContentPageTree('dummy')).thenReturn(of(tree));

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ contentPageId: 'dummy' }) });
      const expected$ = cold('b-b-b-b', { b: loadContentPageTree({ contentPageId: 'parent' }) });

      expect(effects.loadContentPageTree$).toBeObservable(expected$);
    });

    it('should map to action of type CreatePageTreeSuccess when actual tree does contain navigation root', () => {
      const tree = { parent: undefined, page: { itemId: 'parent' } } as ContentPageletTreeData;
      when(cmsServiceMock.getContentPageTree('dummy')).thenReturn(of(tree));

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ contentPageId: 'dummy' }) });
      const expected$ = cold('b-b-b-b', { b: loadContentPageTreeSuccess({ tree }) });

      expect(effects.loadContentPageTree$).toBeObservable(expected$);
    });
  });

  describe('selectedContentPage$', () => {
    it('should load page tree when url parameter is available', done => {
      effects.selectedContentPage$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Content Page] Load Content Page Tree:
            contentPageId: "dummy"
        `);
        done();
      });

      router.navigateByUrl('/page/dummy');
    });
  });
});
