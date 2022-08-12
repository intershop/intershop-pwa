import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-tree.actions';
import { PageTreeEffects } from './page-tree.effects';

describe('Page Tree Effects', () => {
  let actions$: Observable<Action>;
  let effects: PageTreeEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      providers: [
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
        PageTreeEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(PageTreeEffects);
  });

  describe('loadContentPageTree$', () => {
    it('should send fail action when loading action via service is unsuccessful', done => {
      when(cmsServiceMock.getContentPageTree('dummy', 2)).thenReturn(
        throwError(() => makeHttpError({ message: 'ERROR' }))
      );

      actions$ = of(loadContentPageTree({ rootId: 'dummy', depth: 2 }));

      effects.loadContentPageTree$.subscribe(action => {
        verify(cmsServiceMock.getContentPageTree('dummy', 2)).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Page Tree API] Load Content Page Tree Fail:
            error: {"name":"HttpErrorResponse","message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(cmsServiceMock.getContentPageTree('dummy', 2)).thenReturn(
        throwError(() => makeHttpError({ message: 'ERROR' }))
      );

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ rootId: 'dummy', depth: 2 }) });

      expect(effects.loadContentPageTree$).toBeObservable(
        cold('a-a-a-a', { a: loadContentPageTreeFail({ error: makeHttpError({ message: 'ERROR' }) }) })
      );
    });

    it('should map to action of type CreatePageTreeSuccess when actual tree does contain navigation root', () => {
      const pagetree = { edges: {}, nodes: {} } as ContentPageTree;
      when(cmsServiceMock.getContentPageTree('dummy', 2)).thenReturn(of(pagetree));

      actions$ = hot('a-a-a-a', { a: loadContentPageTree({ rootId: 'dummy', depth: 2 }) });
      const expected$ = cold('b-b-b-b', { b: loadContentPageTreeSuccess({ pagetree }) });

      expect(effects.loadContentPageTree$).toBeObservable(expected$);
    });
  });
});
