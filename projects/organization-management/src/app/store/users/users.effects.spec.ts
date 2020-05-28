import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { User } from 'ish-core/models/user/user.model';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { UsersService } from '../../services/users/users.service';

import * as actions from './users.actions';
import { UsersEffects } from './users.effects';

describe('Users Effects', () => {
  let actions$: Observable<Action>;
  let effects: UsersEffects;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = mock(UsersService);
    when(usersService.getUsers()).thenReturn(of([{ businessPartnerNo: '1' }, { businessPartnerNo: '2' }] as User[]));

    TestBed.configureTestingModule({
      imports: [ngrxTesting()],
      providers: [
        UsersEffects,
        provideMockActions(() => actions$),
        { provide: UsersService, useFactory: () => instance(usersService) },
      ],
    });

    effects = TestBed.inject(UsersEffects);
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
            users: [{"businessPartnerNo":"1"},{"businessPartnerNo":"2"}]
        `);
        done();
      });
    });
  });
});
