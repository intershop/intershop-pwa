import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UsersService } from '../../services/users/users.service';
import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import {
  addUser,
  addUserFail,
  deleteUser,
  deleteUserSuccess,
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  setUserBudget,
  setUserBudgetFail,
  setUserBudgetSuccess,
  setUserRolesSuccess,
  updateUser,
  updateUserFail,
  updateUserSuccess,
} from './users.actions';
import { UsersEffects } from './users.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

const users = [
  {
    login: '1',
    firstName: 'Patricia',
    lastName: 'Miller',
    name: 'Patricia Miller',
    budget: {
      budget: { value: 500, currency: 'USD' },
      orderSpentLimit: { value: 9000, currency: 'USD' },
      budgetPeriod: 'monthly',
    },
  },
  { login: '2' },
] as B2bUser[];

describe('Users Effects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let usersService: UsersService;
  let router: Router;
  let location: Location;
  let store$: Store;

  beforeEach(() => {
    usersService = mock(UsersService);
    when(usersService.getUsers()).thenReturn(of(users));
    when(usersService.getUser(anything())).thenReturn(of(users[0]));
    when(usersService.addUser(anything())).thenReturn(of(users[0]));
    when(usersService.updateUser(anything())).thenReturn(of(users[0]));
    when(usersService.getUsers()).thenReturn(of(users));
    when(usersService.deleteUser(anything())).thenReturn(of(true));
    when(usersService.setUserBudget(anyString(), anything())).thenReturn(of(users[0].userBudget));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        OrganizationManagementStoreModule.forTesting('users'),
        RouterTestingModule.withRoutes([
          { path: 'users/:B2BCustomerLogin', component: DummyComponent },
          { path: 'users/:B2BCustomerLogin/edit', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
      ],
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useFactory: () => instance(usersService) },
      ],
    });

    effects = TestBed.inject(UsersEffects);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store$ = TestBed.inject(Store);
  });

  describe('loadUsers$', () => {
    it('should call the service for retrieving users', done => {
      actions$ = of(loadUsers());

      effects.loadUsers$.subscribe(() => {
        verify(usersService.getUsers()).once();
        done();
      });
    });

    it('should retrieve users when triggered', done => {
      actions$ = of(loadUsers());

      effects.loadUsers$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
            [Users API] Load Users Success:
              users: [{"login":"1","firstName":"Patricia","lastName":"Miller","na...
          `);
        done();
      });
    });

    it('should dispatch a loadUsersFail action on failed users load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(usersService.getUsers()).thenReturn(throwError(error));

      const action = loadUsers();
      const completion = loadUsersFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadUsers$).toBeObservable(expected$);
    });
  });

  describe('loadDetailedUser$', () => {
    it('should call the service for retrieving user', done => {
      router.navigate(['users', '1']);

      effects.loadDetailedUser$.subscribe(() => {
        verify(usersService.getUser(users[0].login)).once();
        done();
      });
    });

    it('should retrieve the user when triggered', done => {
      router.navigate(['users', '1']);

      effects.loadDetailedUser$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
            [Users API] Load User Success:
              user: {"login":"1","firstName":"Patricia","lastName":"Miller","nam...
          `);
        done();
      });
    });
  });

  describe('addUser$', () => {
    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/users/create');
      tick(500);
    }));

    it('should call the service for adding a user', done => {
      actions$ = of(addUser({ user: users[0] }));

      effects.addUser$.subscribe(() => {
        verify(usersService.addUser(anything())).once();
        done();
      });
    });

    it('should create a user when triggered', done => {
      actions$ = of(addUser({ user: users[0] }));

      effects.addUser$.pipe(toArray()).subscribe(
        actions => {
          expect(actions).toMatchInlineSnapshot(`
            [Users API] Add User Success:
              user: {"login":"1","firstName":"Patricia","lastName":"Miller","nam...
            [Message] Success Toast:
              message: "account.organization.user_management.new_user.confirmation"
              messageParams: {"0":"Patricia Miller"}
          `);
        },
        fail,
        done
      );
    });

    it('should navigate to user detail on success', done => {
      actions$ = of(addUser({ user: users[0] }));

      effects.addUser$.subscribe(
        () => {
          expect(location.path()).toMatchInlineSnapshot(`"/users/1"`);
        },
        fail,
        done
      );
    });

    it('should dispatch an UpdateUserFail action on failed user update', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(usersService.addUser(anything())).thenReturn(throwError(error));

      const action = addUser({ user: users[0] });
      const completion = addUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.addUser$).toBeObservable(expected$);
    });
  });

  describe('updateUser$', () => {
    it('should call the service for updating a user', done => {
      actions$ = of(updateUser({ user: users[0] }));

      effects.updateUser$.subscribe(() => {
        verify(usersService.updateUser(anything())).once();
        done();
      });
    });

    it('should update a user when triggered', () => {
      const action = updateUser({ user: users[0] });

      const completion = updateUserSuccess({ user: users[0] });

      actions$ = hot('        -a-a-a-|', { a: action });
      const expected$ = cold('-c-c-c-|', { c: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserFail action on failed user update', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(usersService.updateUser(anything())).thenReturn(throwError(error));

      const action = updateUser({ user: users[0] });
      const completion = updateUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });
  });

  describe('updateUserBudget$', () => {
    it('should call the service for updating user budget', done => {
      actions$ = of(setUserBudget({ login: users[0].login, budget: users[0].userBudget }));

      effects.setUserBudget$.subscribe(() => {
        verify(usersService.setUserBudget(users[0].login, anything())).once();
        done();
      });
    });

    it('should update user budget when triggered', () => {
      const action = setUserBudget({ login: users[0].login, budget: users[0].userBudget });

      const completion = setUserBudgetSuccess({ login: users[0].login, budget: users[0].userBudget });
      actions$ = hot('        -a-a-a-|', { a: action });
      const expected$ = cold('-c-c-c-|', { c: completion });

      expect(effects.setUserBudget$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserFail action on failed user update', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(usersService.setUserBudget(anyString(), anything())).thenReturn(throwError(error));

      const action = setUserBudget({ login: users[0].login, budget: users[0].userBudget });
      const completion = setUserBudgetFail({ login: users[0].login, error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.setUserBudget$).toBeObservable(expected$);
    });
  });

  describe('deleteUser$', () => {
    const login = 'pmiller@test.intershop.de';

    it('should call the service for delete user', done => {
      actions$ = of(deleteUser({ login }));

      effects.deleteUser$.subscribe(() => {
        verify(usersService.deleteUser(anything())).once();
        done();
      });
    });

    it('should delete user when triggered', () => {
      const action = deleteUser({ login });
      const completion1 = deleteUserSuccess({
        login,
      });
      const completion2 = displaySuccessMessage({
        message: 'account.user.delete_user.confirmation',
      });

      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });
      expect(effects.deleteUser$).toBeObservable(expected$);
    });
  });

  describe('successMessageAfterUpdate$', () => {
    beforeEach(() => {
      store$.dispatch(loadUsersSuccess({ users }));
    });

    describe('on user edit', () => {
      const completion = displaySuccessMessage({
        message: 'account.organization.user_management.update_user.confirmation',
        messageParams: { 0: `${users[0].firstName} ${users[0].lastName}` },
      });

      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/users/1/edit');
        tick(500);
      }));

      it('should display success message after user update', () => {
        const action = updateUserSuccess({ user: users[0] });

        actions$ = hot('        -a-a-a-|', { a: action });
        const expected$ = cold('-c-c-c-|', { c: completion });

        expect(effects.successMessageAfterUpdate$).toBeObservable(expected$);
      });

      it('should display success message after role update', () => {
        const action = setUserRolesSuccess({ login: '1', roles: [] });

        actions$ = hot('        -a-a-a-|', { a: action });
        const expected$ = cold('-c-c-c-|', { c: completion });

        expect(effects.successMessageAfterUpdate$).toBeObservable(expected$);
      });

      it('should display success message after role update', () => {
        const action = setUserBudgetSuccess({ login: '1', budget: undefined });

        actions$ = hot('        -a-a-a-|', { a: action });
        const expected$ = cold('-c-c-c-|', { c: completion });

        expect(effects.successMessageAfterUpdate$).toBeObservable(expected$);
      });
    });

    describe('somewhere else', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/any');
        tick(500);
      }));

      it('should not display success message after user update', () => {
        const action = updateUserSuccess({ user: users[0] });

        actions$ = hot('        -a-a-a-|', { a: action });
        const expected$ = cold('-------|');

        expect(effects.successMessageAfterUpdate$).toBeObservable(expected$);
      });

      it('should not display success message after role update', () => {
        const action = setUserRolesSuccess({ login: '1', roles: [] });

        actions$ = hot('        -a-a-a-|', { a: action });
        const expected$ = cold('-------|');

        expect(effects.successMessageAfterUpdate$).toBeObservable(expected$);
      });
    });
  });
});
