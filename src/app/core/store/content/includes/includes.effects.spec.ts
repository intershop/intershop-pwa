import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, Subject, noop, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
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
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
        IncludesEffects,
        provideMockActions(() => actions$),
      ],
    });
    effects = TestBed.inject(IncludesEffects);
  });

  describe('loadContentInclude$', () => {
    it('should send success action when loading action via service is successful', done => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(
        of({ include: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );

      actions$ = of(personalizationStatusDetermined(), loadContentInclude({ includeId: 'dummy' }));

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
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(throwError(() => makeHttpError({ message: 'ERROR' })));

      actions$ = of(personalizationStatusDetermined(), loadContentInclude({ includeId: 'dummy' }));

      effects.loadContentInclude$.subscribe(action => {
        verify(cmsServiceMock.getContentInclude('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Include API] Load Content Include Fail:
            error: {"name":"HttpErrorResponse","message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', fakeAsync(() => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(throwError(() => makeHttpError({ message: 'ERROR' })));
      const dispatched$ = new Subject<Action>();
      actions$ = dispatched$;

      const results: Action[] = [];
      effects.loadContentInclude$.subscribe(action => results.push(action));

      dispatched$.next(personalizationStatusDetermined());
      for (let i = 0; i < 3; i++) {
        dispatched$.next(loadContentInclude({ includeId: 'dummy' }));
        tick(0);
      }

      expect(results).toEqual([
        loadContentIncludeFail({ error: makeHttpError({ message: 'ERROR' }) }),
        loadContentIncludeFail({ error: makeHttpError({ message: 'ERROR' }) }),
        loadContentIncludeFail({ error: makeHttpError({ message: 'ERROR' }) }),
      ]);
    }));

    it('should load includes requested before the personalization status is determined afterwards', fakeAsync(() => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(throwError(() => makeHttpError({ message: 'ERROR' })));
      const dispatched$ = new Subject<Action>();
      actions$ = dispatched$;

      const results: Action[] = [];
      effects.loadContentInclude$.subscribe(action => results.push(action));

      dispatched$.next(loadContentInclude({ includeId: 'dummy' }));
      tick(0);
      expect(results).toBeEmpty();

      dispatched$.next(personalizationStatusDetermined());
      tick(0);
      expect(results).toEqual([loadContentIncludeFail({ error: makeHttpError({ message: 'ERROR' }) })]);
    }));

    it('should load an include only once for the requests released after the personalization status is determined', fakeAsync(() => {
      when(cmsServiceMock.getContentInclude('dummy')).thenReturn(
        of({ include: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );
      const dispatched$ = new Subject<Action>();
      actions$ = dispatched$;

      effects.loadContentInclude$.subscribe(noop);

      // e.g. requested before and after the PGID of the restored user is set
      dispatched$.next(loadContentInclude({ includeId: 'dummy' }));
      dispatched$.next(loadContentInclude({ includeId: 'dummy' }));
      dispatched$.next(personalizationStatusDetermined());
      tick(0);

      verify(cmsServiceMock.getContentInclude('dummy')).once();
    }));
  });
});
