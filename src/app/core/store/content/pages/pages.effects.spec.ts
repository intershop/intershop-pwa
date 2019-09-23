import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { LoadContentPage, LoadContentPageFail } from './pages.actions';
import { PagesEffects } from './pages.effects';

describe('Pages Effects', () => {
  let actions$: Observable<Action>;
  let effects: PagesEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      imports: [ngrxTesting()],
      providers: [
        PagesEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });

    effects = TestBed.get(PagesEffects);
  });

  describe('loadPages$', () => {
    it('should send fail action when loading action via service is unsuccessful', done => {
      when(cmsServiceMock.getContentPage('dummy')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = of(new LoadContentPage({ contentPageId: 'dummy' }));

      effects.loadContentPage$.subscribe((action: LoadContentPageFail) => {
        verify(cmsServiceMock.getContentPage('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Page API] Load Content Page Fail:
            error: {"message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(cmsServiceMock.getContentPage('dummy')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = hot('a-a-a-a', { a: new LoadContentPage({ contentPageId: 'dummy' }) });

      expect(effects.loadContentPage$).toBeObservable(
        cold('a-a-a-a', { a: new LoadContentPageFail({ error: { message: 'ERROR' } as HttpError }) })
      );
    });
  });
});
