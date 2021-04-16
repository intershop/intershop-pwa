import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ContentPageletTree } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';
import { PageTreesEffects } from './page-trees.effects';

describe('Page Trees Effects', () => {
  let actions$: Observable<Action>;
  let effects: PageTreesEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      providers: [
        PageTreesEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });

    effects = TestBed.inject(PageTreesEffects);
  });

  describe('loadContentPageTree$', () => {
    it('should send fail action when loading action via service is unsuccessful', done => {
      when(cmsServiceMock.getContentPageTree('dummy', '2')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = of(loadContentPageTree({ contentPageId: 'dummy', depth: '2' }));

      effects.loadContentPageTree$.subscribe(action => {
        verify(cmsServiceMock.getContentPageTree('dummy', '2')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Page API] Load Content Page Tree Fail:
            error: {"name":"HttpErrorResponse","message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(cmsServiceMock.getContentPageTree('dummy', '2')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ contentPageId: 'dummy', depth: '2' }) });

      expect(effects.loadContentPageTree$).toBeObservable(
        cold('a-a-a-a', { a: loadContentPageTreeFail({ error: makeHttpError({ message: 'ERROR' }) }) })
      );
    });

    it('should map to action of type CreatePageTreeSuccess when actual tree does contain navigation root', () => {
      const tree = { edges: {}, nodes: {} } as ContentPageletTree;
      when(cmsServiceMock.getContentPageTree('dummy', '2')).thenReturn(of(tree));

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ contentPageId: 'dummy', depth: '2' }) });
      const expected$ = cold('b-b-b-b', { b: loadContentPageTreeSuccess({ tree }) });

      expect(effects.loadContentPageTree$).toBeObservable(expected$);
    });
  });
});
