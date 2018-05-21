import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { Customer } from '../../../models/customer/customer.model';
import { User } from '../../../models/user/user.model';
import { RegistrationService } from '../../../registration/services/registration/registration.service';
import { CoreState } from '../core.state';
import { coreReducers } from '../core.system';
import * as ua from './user.actions';
import { UserEffects } from './user.effects';

describe('User Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let store$: Store<CoreState>;
  let registrationServiceMock: RegistrationService;
  let routerMock: Router;

  beforeEach(() => {
    routerMock = mock(Router);
    registrationServiceMock = mock(RegistrationService);
    when(registrationServiceMock.signinUser(anything())).thenReturn(of({} as Customer));
    when(registrationServiceMock.createUser(anything())).thenReturn(of({} as Customer));
    when(registrationServiceMock.getCompanyUserData()).thenReturn(of({ type: 'SMBCustomerUser' } as User));

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: RegistrationService, useFactory: () => instance(registrationServiceMock) },
      ],
    });

    effects = TestBed.get(UserEffects);
    store$ = TestBed.get(Store);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', () => {
      const action = new ua.LoginUser({ login: 'dummy', password: 'dummy' });

      actions$ = hot('-a', { a: action });

      effects.loginUser$.subscribe(() => verify(registrationServiceMock.signinUser(anything())).once());
    });

    it('should dispatch a LoginUserSuccess action on successful login', () => {
      const action = new ua.LoginUser({ login: 'dummy', password: 'dummy' });
      const completion = new ua.LoginUserSuccess({} as Customer);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(registrationServiceMock.signinUser(anything())).thenReturn(throwError(error));

      const action = new ua.LoginUser({ login: 'dummy', password: 'dummy' });
      const completion = new ua.LoginUserFail(error);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });
      expect(effects.loginUser$).toBeObservable(expected$);
    });
  });

  describe('loadCompanyUser$', () => {
    it('should call the registationService for LoadCompanyUser', () => {
      const action = new ua.LoadCompanyUser();
      actions$ = hot('-a', { a: action });

      effects.loadCompanyUser$.subscribe(() => {
        verify(registrationServiceMock.getCompanyUserData()).once();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const type = 'SMBCustomerUser';
      const action = new ua.LoadCompanyUser();
      const completion = new ua.LoadCompanyUserSuccess({ type } as User);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });

    // TODO: test LoadBasketFail
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
        verify(registrationServiceMock.createUser(anything())).once();
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
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(registrationServiceMock.createUser(anything())).thenReturn(throwError(error));

      const action = new ua.CreateUser({} as Customer);
      const completion = new ua.CreateUserFail(error);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });
  });

  describe('resetUserError$', () => {
    it('should not dispatch UserErrorReset action on router navigation if error is not set', () => {
      actions$ = hot('a', { a: new RouteNavigation({ path: 'any', params: {}, queryParams: {} }) });

      expect(effects.resetUserError$).toBeObservable(cold('-'));
    });

    it('should dispatch UserErrorReset action on router navigation if error was set', () => {
      store$.dispatch(new ua.LoginUserFail({ message: 'error' } as HttpErrorResponse));

      actions$ = hot('a', { a: new RouteNavigation({ path: 'any', params: {}, queryParams: {} }) });

      expect(effects.resetUserError$).toBeObservable(cold('a', { a: new ua.UserErrorReset() }));
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
