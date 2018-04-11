import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { Customer } from '../../../models/customer/customer.model';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { coreReducers } from '../core.system';
import * as ua from './user.actions';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let accountLoginServiceMock: AccountLoginService;
  let routerMock: Router;

  beforeEach(() => {
    routerMock = mock(Router);
    accountLoginServiceMock = mock(AccountLoginService);
    when(accountLoginServiceMock.signinUser(anything())).thenReturn(of({} as Customer));
    when(accountLoginServiceMock.createUser(anything())).thenReturn(of({} as Customer));

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
      ],
    });

    effects = TestBed.get(UserEffects);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', () => {
      const action = new ua.LoginUser({ userName: 'dummy' });

      actions$ = hot('-a', { a: action });

      effects.loginUser$.subscribe(() => verify(accountLoginServiceMock.signinUser(anything())).once());
    });

    it('should dispatch a LoginUserSuccess action on successful login', () => {
      const action = new ua.LoginUser({ userName: 'dummy' });
      const completion = new ua.LoginUserSuccess({} as Customer);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      when(accountLoginServiceMock.signinUser(anything())).thenReturn(_throw({ status: 401 }));

      const action = new ua.LoginUser({ userName: 'dummy' });
      const completion = new ua.LoginUserFail({ status: 401 } as HttpErrorResponse);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });
      expect(effects.loginUser$).toBeObservable(expected$);
    });
  });

  describe('goToHomeAfterLogout$', () => {
    it('should navigate to /home after LogoutUser', () => {
      const action = new ua.LogoutUser();
      actions$ = hot('-a', { a: action });

      effects.goToHomeAfterLogout$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/home']);
      });
    });
  });

  describe('goToAccountAfterLogin$', () => {
    it('should navigate to /account after LoginUserSuccess', () => {
      const action = new ua.LoginUserSuccess({} as Customer);

      actions$ = hot('-a', { a: action });

      effects.goToAccountAfterLogin$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/account']);
      });
    });
  });

  describe('createUser$', () => {
    it('should call the api service when Create event is called', () => {
      const action = new ua.CreateUser({} as Customer);

      actions$ = hot('-a', { a: action });

      effects.createUser$.subscribe(() => {
        verify(accountLoginServiceMock.createUser(anything())).once();
      });
    });

    it('should dispatch a CreateUserSuccess action on successful user creation', () => {
      const action = new ua.CreateUser({} as Customer);
      const completion = new ua.CreateUserSuccess({} as Customer);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a CreateUserFail action on failed user creation', () => {
      when(accountLoginServiceMock.createUser(anything())).thenReturn(_throw({ status: 401 }));

      const action = new ua.CreateUser({} as Customer);
      const completion = new ua.CreateUserFail({ status: 401 } as HttpErrorResponse);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });
  });

  describe('publishLoginEventAfterCreate$', () => {
    it('should dispatch a LoginUserSuccess when CreateUserSuccess arrives', () => {
      const action = new ua.CreateUserSuccess({} as Customer);
      const completion = new ua.LoginUserSuccess({} as Customer);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.publishLoginEventAfterCreate$).toBeObservable(expected$);
    });
  });
});
