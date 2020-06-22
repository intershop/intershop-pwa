import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { UsersService } from '../../services/users/users.service';
import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import * as actions from './users.actions';
import { UsersEffects } from './users.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

const users = [{ login: '1', firstName: 'Patricia', lastName: 'Miller' }, { login: '2' }] as User[];

describe('Users Effects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let usersService: UsersService;
  let store$: TestStore;
  let router: Router;

  beforeEach(() => {
    usersService = mock(UsersService);
    when(usersService.getUsers()).thenReturn(of(users));
    when(usersService.getUser(anything())).thenReturn(of(users[0]));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        OrganizationManagementStoreModule.forTesting('users'),
        RouterTestingModule.withRoutes([{ path: 'users/:B2BCustomerLogin', component: DummyComponent }]),
        TranslateModule.forRoot(),
        ngrxTesting({
          routerStore: true,
        }),
      ],
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useFactory: () => instance(usersService) },
      ],
    });

    effects = TestBed.inject(UsersEffects);
    store$ = TestBed.inject(TestStore);
    router = TestBed.inject(Router);
  });

  describe('loadUsers$', () => {
    it('should call the service for retrieving users', done => {
      actions$ = of(new actions.LoadUsers());

      effects.loadUsers$.subscribe(() => {
        verify(usersService.getUsers()).once();
        done();
      });
    });

    it('should retrieve users when triggered', done => {
      actions$ = of(new actions.LoadUsers());

      effects.loadUsers$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Users API] Load Users Success:
            users: [{"login":"1","firstName":"Patricia","lastName":"Miller"},{"...
        `);
        done();
      });
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
            user: {"login":"1","firstName":"Patricia","lastName":"Miller"}
        `);
        done();
      });
    });
  });

  describe('setUserDetailBreadcrumb$', () => {
    it('should set the breadcrumb of user detail', done => {
      store$.dispatch(new actions.LoadUsersSuccess({ users }));
      router.navigate(['users', '1']);
      effects.setUserDetailBreadcrumb$.subscribe(action => {
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "breadcrumbData": Array [
              Object {
                "key": "account.organization.user_management",
                "link": "/account/organization/users",
              },
              Object {
                "text": "account.organization.user_management.user_detail.breadcrumb - Patricia Miller",
              },
            ],
          }
        `);
        done();
      });
    });
  });
});
