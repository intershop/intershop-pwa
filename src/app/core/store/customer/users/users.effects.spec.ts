import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { B2bUser } from 'ish-core/models/b2b-user/b2b-user.model';
import { UserService } from 'ish-core/services/user/user.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadCustomerUsers, loadCustomerUsersFail } from './users.actions';
import { UsersEffects } from './users.effects';

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
    roleIDs: ['APP_USER_ROLE'],
  },
  { login: '2' },
] as B2bUser[];

describe('Users Effects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let userService: UserService;

  beforeEach(() => {
    userService = mock(UserService);
    when(userService.getUsers()).thenReturn(of(users));

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useFactory: () => instance(userService) },
        provideMockActions(() => actions$),
        UsersEffects,
      ],
    });

    effects = TestBed.inject(UsersEffects);
  });

  describe('loadUsers$', () => {
    it('should call the service for retrieving users', done => {
      actions$ = of(loadCustomerUsers());

      effects.loadUsers$.subscribe(() => {
        verify(userService.getUsers()).once();
        done();
      });
    });

    it('should retrieve users when triggered', done => {
      actions$ = of(loadCustomerUsers());

      effects.loadUsers$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
            [Users API] Load Users of Customer Success:
              users: [{"login":"1","firstName":"Patricia","lastName":"Miller","na...
          `);
        done();
      });
    });

    it('should dispatch a loadUsersFail action on failed users load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(userService.getUsers()).thenReturn(throwError(() => error));

      const action = loadCustomerUsers();
      const completion = loadCustomerUsersFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadUsers$).toBeObservable(expected$);
    });
  });
});
