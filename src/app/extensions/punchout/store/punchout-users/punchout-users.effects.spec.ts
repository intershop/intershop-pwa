import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  addPunchoutUser,
  addPunchoutUserFail,
  deletePunchoutUser,
  deletePunchoutUserFail,
  deletePunchoutUserSuccess,
  loadPunchoutUsers,
  loadPunchoutUsersFail,
  loadPunchoutUsersSuccess,
  updatePunchoutUser,
  updatePunchoutUserFail,
} from './punchout-users.actions';
import { PunchoutUsersEffects } from './punchout-users.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

describe('Punchout Users Effects', () => {
  let actions$: Observable<Action>;
  let effects: PunchoutUsersEffects;
  let punchoutService: PunchoutService;
  let location: Location;
  let router: Router;

  const users = [{ id: 'ociUser', login: 'ociuser@test.de', email: 'ociuser@test.de' }] as PunchoutUser[];

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getUsers()).thenReturn(of(users));
    when(punchoutService.createUser(users[0])).thenReturn(of(users[0]));
    when(punchoutService.updateUser(anything())).thenReturn(of(users[0]));
    when(punchoutService.deleteUser(users[0].login)).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { path: 'account/punchout', component: DummyComponent },
          { path: 'account/punchout/:PunchoutLogin', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
      ],
      providers: [
        PunchoutUsersEffects,
        provideMockActions(() => actions$),
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
      ],
    });

    effects = TestBed.inject(PunchoutUsersEffects);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
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

  describe('loadDetailedUser$', () => {
    it('should call the service for retrieving user', done => {
      router.navigate(['/account/punchout', 'ociuser@test.de']);

      effects.loadDetailedUser$.subscribe(() => {
        verify(punchoutService.getUsers()).once();
        done();
      });
    });

    it('should retrieve the user when triggered', done => {
      router.navigate(['/account/punchout', 'ociuser@test.de']);

      effects.loadDetailedUser$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Punchout API] Load Punchout Users Success:
            users: [{"id":"ociUser","login":"ociuser@test.de","email":"ociuser@...
        `);
        done();
      });
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

    it('should map to action of type AddPunchoutUserSuccess and DisplaySuccessMessage and navigate to "/account/punchout"', done => {
      const action = addPunchoutUser({ user: users[0] });
      actions$ = of(action);

      effects.createPunchoutUser$.pipe(toArray()).subscribe(
        actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Punchout API] Add Punchout User Success:
              user: {"id":"ociUser","login":"ociuser@test.de","email":"ociuser@t...
            [Message] Success Toast:
              message: "account.punchout.user.created.message"
              messageParams: {"0":"ociuser@test.de"}
          `);
          expect(location.path()).toMatchInlineSnapshot(`"/account/punchout"`);
        },
        fail,
        done
      );
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

  describe('updatePunchoutUser$', () => {
    it('should call the service for updating a punchout user', done => {
      actions$ = of(updatePunchoutUser({ user: users[0] }));

      effects.updatePunchoutUser$.subscribe(() => {
        verify(punchoutService.updateUser(anything())).once();
        done();
      });
    });

    it('should map to action of type UpdatePunchoutUserSuccess and DisplaySuccessMessage and navigate to "/account/punchout"', done => {
      const action = updatePunchoutUser({ user: users[0] });
      actions$ = of(action);

      effects.updatePunchoutUser$.pipe(toArray()).subscribe(
        actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Punchout API] Update Punchout User Success:
              user: {"id":"ociUser","login":"ociuser@test.de","email":"ociuser@t...
            [Message] Success Toast:
              message: "account.punchout.user.updated.message"
              messageParams: {"0":"ociuser@test.de"}
          `);
          expect(location.path()).toMatchInlineSnapshot(`"/account/punchout"`);
        },
        fail,
        done
      );
    });

    it('should dispatch a UpdatePunchoutUserFail action on failed user creation', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.updateUser(users[0])).thenReturn(throwError(error));

      const action = updatePunchoutUser({ user: users[0] });
      const completion = updatePunchoutUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updatePunchoutUser$).toBeObservable(expected$);
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
        message: 'account.punchout.user.delete.confirmation',
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
