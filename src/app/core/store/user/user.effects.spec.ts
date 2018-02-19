import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { reducers } from '../core.system';
import { Go } from '../router/router.actions';
import * as ua from './user.actions';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  let actions$: TestActions;
  let effects: UserEffects;
  let accountLoginServiceMock: AccountLoginService;

  beforeEach(() => {
    accountLoginServiceMock = mock(AccountLoginService);
    when(accountLoginServiceMock.signinUser(anything())).thenReturn(of({} as any));
    when(accountLoginServiceMock.createUser(anything())).thenReturn(of({} as any));

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
      ],
      providers: [
        UserEffects,
        { provide: Actions, useFactory: testActionsFactory },
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(UserEffects);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', () => {
      const action = new ua.LoginUser({ userName: 'dummy' });

      actions$.stream = hot('-a', { a: action });

      effects.loginUser$.subscribe(() =>
        verify(accountLoginServiceMock.signinUser(anything())).once()
      );
    });

    it('should dispatch a LoginUserSuccess action on successful login', () => {
      const action = new ua.LoginUser({ userName: 'dummy' });
      const completion = new ua.LoginUserSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      when(accountLoginServiceMock.signinUser(anything())).thenReturn(_throw({}));

      const action = new ua.LoginUser({ userName: 'dummy' });
      const completion = new ua.LoginUserFail({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected);
    });
  });

  describe('goToHomeAfterLogout$', () => {
    it('should dispatch a router event to /home after LogoutUser', () => {
      const action = new ua.LogoutUser();
      const completion = new Go({ path: ['/home'] });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.goToHomeAfterLogout$).toBeObservable(expected);
    });
  });

  describe('goToAccountAfterLogin$', () => {
    it('should dispatch a router event to /account after LoginUserSuccess', () => {
      const action = new ua.LoginUserSuccess({} as any);
      const completion = new Go({ path: ['/account'] });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.goToAccountAfterLogin$).toBeObservable(expected);
    });
  });

  describe('createUser$', () => {
    it('should call the api service when Create event is called', () => {
      const action = new ua.CreateUser({} as any);

      actions$.stream = hot('-a', { a: action });

      effects.createUser$.subscribe(() => {
        verify(accountLoginServiceMock.createUser(anything())).once();
      });
    });

    it('should dispatch a CreateUserSuccess action on successful user creation', () => {
      const action = new ua.CreateUser({} as any);
      const completion = new ua.CreateUserSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected);
    });

    it('should dispatch a CreateUserFail action on failed user creation', () => {
      when(accountLoginServiceMock.createUser(anything())).thenReturn(_throw({}));

      const action = new ua.CreateUser({} as any);
      const completion = new ua.CreateUserFail({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected);
    });
  });

  describe('publishLoginEventAfterCreate$', () => {
    it('should dispatch a LoginUserSuccess when CreateUserSuccess arrives', () => {
      const action = new ua.CreateUserSuccess({} as any);
      const completion = new ua.LoginUserSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.publishLoginEventAfterCreate$).toBeObservable(expected);
    });
  });
});
