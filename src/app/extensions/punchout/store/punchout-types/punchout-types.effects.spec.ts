import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { loadPunchoutTypes, loadPunchoutTypesFail, loadPunchoutTypesSuccess } from './punchout-types.actions';
import { PunchoutTypesEffects } from './punchout-types.effects';

describe('Punchout Types Effects', () => {
  let actions$: Observable<Action>;
  let effects: PunchoutTypesEffects;
  let punchoutService: PunchoutService;

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getPunchoutTypes()).thenReturn(of(['oci']));
    TestBed.configureTestingModule({
      providers: [
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
        provideMockActions(() => actions$),
        PunchoutTypesEffects,
      ],
    });

    effects = TestBed.inject(PunchoutTypesEffects);
  });

  describe('loadPunchoutTypesInitially$', () => {
    it('should trigger loadPunchoutTypes action if account/punchout page is called', done => {
      actions$ = of(
        routerTestNavigatedAction({
          routerState: { url: '/account/punchout', queryParams: { format: 'oci' } },
        })
      );

      effects.loadPunchoutTypesInitially$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Punchout] Load Punchout Types`);
        done();
      });
    });
  });

  describe('loadPunchoutType$', () => {
    it('should call the service for retrieving punchout types', done => {
      actions$ = of(loadPunchoutTypes());

      effects.loadPunchoutTypes$.subscribe(() => {
        verify(punchoutService.getPunchoutTypes()).once();
        done();
      });
    });
    it('should map to action of type LoadPunchoutTypesSuccess', () => {
      const action = loadPunchoutTypes();
      const completion = loadPunchoutTypesSuccess({ types: ['oci'] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadPunchoutTypes$).toBeObservable(expected$);
    });

    it('should dispatch a loadPunchoutUsersFail action on failed users load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.getPunchoutTypes()).thenReturn(throwError(() => error));

      const action = loadPunchoutTypes();
      const completion = loadPunchoutTypesFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadPunchoutTypes$).toBeObservable(expected$);
    });
  });
});
