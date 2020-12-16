import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutService } from '../../services/punchout/punchout.service';

import { loadPunchoutUsers, loadPunchoutUsersFail, loadPunchoutUsersSuccess } from './oci-punchout.actions';
import { OciPunchoutEffects } from './oci-punchout.effects';

describe('Oci Punchout Effects', () => {
  let actions$: Observable<Action>;
  let effects: OciPunchoutEffects;
  let punchoutService: PunchoutService;

  const users = [{ id: 'ociUser', email: 'ociuser@test.de' }] as PunchoutUser[];

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getUsers()).thenReturn(of(users));

    TestBed.configureTestingModule({
      providers: [
        OciPunchoutEffects,
        provideMockActions(() => actions$),
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
      ],
    });

    effects = TestBed.inject(OciPunchoutEffects);
  });

  describe('loadPunchoutUsers$', () => {
    it('should call the service for retrieving punchout users', done => {
      actions$ = of(loadPunchoutUsers());

      effects.loadPunchoutUsers$.subscribe(() => {
        verify(punchoutService.getUsers()).once();
        done();
      });
    });
    it('should map to action of type LoadPunchoutUsersSuccess', () => {
      const action = loadPunchoutUsers();
      const completion = loadPunchoutUsersSuccess({ users });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadPunchoutUsers$).toBeObservable(expected$);
    });

    it('should dispatch a loadPunchoutUsersFail action on failed users load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.getUsers()).thenReturn(throwError(error));

      const action = loadPunchoutUsers();
      const completion = loadPunchoutUsersFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadPunchoutUsers$).toBeObservable(expected$);
    });
  });
});
