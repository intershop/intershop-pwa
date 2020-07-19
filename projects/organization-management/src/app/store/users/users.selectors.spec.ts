import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadSystemUserRolesSuccess, loadUsers, loadUsersFail, loadUsersSuccess } from './users.actions';
import {
  getRole,
  getRoles,
  getSelectedUser,
  getUsers,
  getUsersError,
  getUsersLoading,
  isSystemUserRolesLoaded,
} from './users.selectors';

@Component({ template: 'dummy' })
class DummyComponent {}

describe('Users Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        OrganizationManagementStoreModule.forTesting('users'),
        RouterTestingModule.withRoutes([{ path: 'users/:B2BCustomerLogin', component: DummyComponent }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getUsersLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getUsersError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getUsers(store$.state)).toBeEmpty();
    });
  });

  describe('LoadUsers', () => {
    const action = loadUsers();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getUsersLoading(store$.state)).toBeTrue();
    });

    describe('LoadUsersSuccess', () => {
      const users = [{ login: '1' }, { login: '2' }] as User[];
      const successAction = loadUsersSuccess({ users });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getUsersLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getUsersError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getUsers(store$.state)).not.toBeEmpty();
      });
    });

    describe('LoadUsersFail', () => {
      const error = makeHttpError({ error: 'ERROR' });
      const failAction = loadUsersFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getUsersLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getUsersError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getUsers(store$.state)).toBeEmpty();
      });
    });
  });

  describe('SelectedUser', () => {
    beforeEach(() => {
      const users = [{ login: '1' }, { login: '2' }] as User[];
      const successAction = loadUsersSuccess({ users });
      store$.dispatch(successAction);
    });

    describe('with category route', () => {
      beforeEach(fakeAsync(() => {
        router.navigate(['users', '1']);
        tick(500);
      }));

      it('should return the category information when used', () => {
        expect(getUsers(store$.state)).not.toBeEmpty();
        expect(getUsersLoading(store$.state)).toBeFalse();
      });

      it('should return the selected user when the customer login is given as query param', () => {
        expect(getSelectedUser(store$.state)).toBeTruthy();
      });
    });
  });

  describe('System Roles', () => {
    it('should be empty for initial state', () => {
      expect(isSystemUserRolesLoaded(store$.state)).toBeFalse();
      expect(getRoles(['A'])(store$.state)).toBeEmpty();
      expect(getRole('A')(store$.state)).toBeUndefined();
    });

    describe('after loading', () => {
      beforeEach(() => {
        store$.dispatch(
          loadSystemUserRolesSuccess({
            roles: [
              {
                id: 'A',
                fixed: true,
                displayName: 'Name_A',
                permissionDisplayNames: ['a1', 'a2'],
              },
              {
                id: 'B',
                fixed: false,
                displayName: 'Name_B',
                permissionDisplayNames: ['b3', 'b2', 'b1'],
              },
            ],
          })
        );
      });

      it('should select roles and permissions for state', () => {
        expect(isSystemUserRolesLoaded(store$.state)).toBeTrue();
        expect(getRoles(['B', 'A'])(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "displayName": "Name_A",
              "fixed": true,
              "id": "A",
              "permissionDisplayNames": Array [
                "a1",
                "a2",
              ],
            },
            Object {
              "displayName": "Name_B",
              "fixed": false,
              "id": "B",
              "permissionDisplayNames": Array [
                "b3",
                "b2",
                "b1",
              ],
            },
          ]
        `);
        expect(getRoles(['A'])(store$.state)).toMatchInlineSnapshot(`
          Array [
            Object {
              "displayName": "Name_A",
              "fixed": true,
              "id": "A",
              "permissionDisplayNames": Array [
                "a1",
                "a2",
              ],
            },
          ]
        `);
        expect(getRole('A')(store$.state)).toMatchInlineSnapshot(`
          Object {
            "displayName": "Name_A",
            "fixed": true,
            "id": "A",
            "permissionDisplayNames": Array [
              "a1",
              "a2",
            ],
          }
        `);
      });
    });
  });
});
