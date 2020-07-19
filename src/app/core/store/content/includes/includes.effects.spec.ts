import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadContentInclude, loadContentIncludeFail } from './includes.actions';
import { IncludesEffects } from './includes.effects';

describe('Includes Effects', () => {
  let actions$: Observable<Action>;
  let effects: IncludesEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      providers: [
        IncludesEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });
    effects = TestBed.inject(IncludesEffects);
  });

  describe('loadContentInclude$', () => {
    it('should send success action when loading action via service is successful', done => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(
        of({ include: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );

      actions$ = of(loadContentInclude({ includeId: 'dummy' }));

      effects.loadContentInclude$.subscribe(action => {
        verify(cmsServiceMock.getContentInclude('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Include API] Load Content Include Success:
            include: {"id":"dummy"}
            pagelets: []
        `);
        done();
      });
    });

    it('should send fail action when loading action via service is unsuccessful', done => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = of(loadContentInclude({ includeId: 'dummy' }));

      effects.loadContentInclude$.subscribe(action => {
        verify(cmsServiceMock.getContentInclude('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Include API] Load Content Include Fail:
            error: {"name":"HttpErrorResponse","message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(throwError(makeHttpError({ message: 'ERROR' })));

      actions$ = hot('a-a-a-a', { a: loadContentInclude({ includeId: 'dummy' }) });

      expect(effects.loadContentInclude$).toBeObservable(
        cold('a-a-a-a', { a: loadContentIncludeFail({ error: makeHttpError({ message: 'ERROR' }) }) })
      );
    });
  });
});
