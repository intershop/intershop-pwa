import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  addPunchoutUser,
  addPunchoutUserFail,
  addPunchoutUserSuccess,
  deletePunchoutUser,
  deletePunchoutUserFail,
  deletePunchoutUserSuccess,
  loadPunchoutUsers,
  loadPunchoutUsersFail,
  loadPunchoutUsersSuccess,
} from './oci-punchout.actions';
import { OciPunchoutEffects } from './oci-punchout.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

describe('Oci Punchout Effects', () => {
  let actions$: Observable<Action>;
  let effects: OciPunchoutEffects;
  let punchoutService: PunchoutService;

  const users = [{ id: 'ociUser', email: 'ociuser@test.de' }] as PunchoutUser[];

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getUsers()).thenReturn(of(users));
    when(punchoutService.createUser(users[0])).thenReturn(of(users[0]));
    when(punchoutService.deleteUser(users[0].login)).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'account/punchout', component: DummyComponent }])],
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

  describe('createPunchoutUser$', () => {
    it('should call the service for adding a punchout user', done => {
      actions$ = of(addPunchoutUser({ user: users[0] }));

      effects.createPunchoutUser$.subscribe(() => {
        verify(punchoutService.createUser(anything())).once();
        done();
      });
    });
    it('should map to action of type AddPunchoutUserSuccess and DisplaySuccessMessage', () => {
      const action = addPunchoutUser({ user: users[0] });

      const completion1 = addPunchoutUserSuccess({ user: users[0] });
      const completion2 = displaySuccessMessage({
        message: 'account.punchout.connection.created.message',
        messageParams: { 0: `${users[0].login}` },
      });

      actions$ = hot('        -a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion1, d: completion2 });

      expect(effects.createPunchoutUser$).toBeObservable(expected$);
    });

    it('should dispatch a AddPunchoutUserFail action on failed user creation', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.createUser(users[0])).thenReturn(throwError(error));

      const action = addPunchoutUser({ user: users[0] });
      const completion = addPunchoutUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createPunchoutUser$).toBeObservable(expected$);
    });
  });

  describe('deletePunchoutUser$', () => {
    it('should call the service for deleting a punchout user', done => {
      actions$ = of(deletePunchoutUser({ login: users[0].login }));

      effects.deletePunchoutUser$.subscribe(() => {
        verify(punchoutService.deleteUser(users[0].login)).once();
        done();
      });
    });
    it('should map to action of type DeletePunchoutUserSuccess and DisplaySuccessMessage', () => {
      const action = deletePunchoutUser({ login: users[0].login });

      const completion1 = deletePunchoutUserSuccess({ login: users[0].login });
      const completion2 = displaySuccessMessage({
        message: 'account.punchout.connection.delete.confirmation',
        messageParams: { 0: `${users[0].login}` },
      });

      actions$ = hot('        -a----a----a----|', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)-|', { c: completion1, d: completion2 });

      expect(effects.deletePunchoutUser$).toBeObservable(expected$);
    });

    it('should dispatch a DeletePunchoutUserFail action on failed user deletion', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.deleteUser(users[0].login)).thenReturn(throwError(error));

      const action = deletePunchoutUser({ login: users[0].login });
      const completion = deletePunchoutUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.deletePunchoutUser$).toBeObservable(expected$);
    });
  });
});
