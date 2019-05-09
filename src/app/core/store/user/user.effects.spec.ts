import { Location } from '@angular/common';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { EMPTY, Observable, noop, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from '../../models/customer/customer.model';
import { HttpErrorMapper } from '../../models/http-error/http-error.mapper';
import { HttpError } from '../../models/http-error/http-error.model';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user/user.service';
import { coreReducers } from '../core-store.module';

import * as ua from './user.actions';
import { UserEffects } from './user.effects';

describe('User Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let store$: Store<{}>;
  let userServiceMock: UserService;
  let router: Router;
  let location: Location;

  const loginResponseData = {
    customer: {
      type: 'SMBCustomer',
      customerNo: 'PC',
    },
  } as CustomerUserType;

  // tslint:disable-next-line:use-component-change-detection
  @Component({ template: 'dummy' })
  // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
  class DummyComponent {}

  beforeEach(() => {
    userServiceMock = mock(UserService);
    when(userServiceMock.signinUser(anything())).thenReturn(of(loginResponseData));
    when(userServiceMock.createUser(anything())).thenReturn(of(undefined));
    when(userServiceMock.updateUser(anything())).thenReturn(of({ firstName: 'Patricia' } as User));
    when(userServiceMock.getCompanyUserData()).thenReturn(of({ firstName: 'Patricia' } as User));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'home', component: DummyComponent },
          { path: 'account', component: DummyComponent },
          { path: 'foobar', component: DummyComponent },
        ]),
        StoreModule.forRoot(coreReducers),
      ],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useFactory: () => instance(userServiceMock) },
      ],
    });

    effects = TestBed.get(UserEffects);
    store$ = TestBed.get(Store);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', done => {
      const action = new ua.LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });

      actions$ = of(action);

      effects.loginUser$.subscribe(() => {
        verify(userServiceMock.signinUser(anything())).once();
        done();
      });
    });

    it('should dispatch a LoginUserSuccess action on successful login', () => {
      const action = new ua.LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = new ua.LoginUserSuccess(loginResponseData);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(userServiceMock.signinUser(anything())).thenReturn(throwError(error));

      const action = new ua.LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = new ua.LoginUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.loginUser$).toBeObservable(expected$);
    });
  });

  describe('loadCompanyUser$', () => {
    it('should call the registationService for LoadCompanyUser', done => {
      const action = new ua.LoadCompanyUser();
      actions$ = of(action);

      effects.loadCompanyUser$.subscribe(() => {
        verify(userServiceMock.getCompanyUserData()).once();
        done();
      });
    });
    it('should map to action of type LoadCompanyUserSuccess', () => {
      const action = new ua.LoadCompanyUser();
      const completion = new ua.LoadCompanyUserSuccess({ user: { firstName: 'Patricia' } as User });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoadCompanyUserFail action on failed for LoadCompanyUser', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.getCompanyUserData()).thenReturn(throwError(error));

      const action = new ua.LoadCompanyUser();
      const completion = new ua.LoadCompanyUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });
  });

  describe('goToHomeAfterLogout$', () => {
    it('should navigate to /home after LogoutUser', fakeAsync(() => {
      const action = new ua.LogoutUser();
      actions$ = of(action);

      effects.goToHomeAfterLogout$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/home');
    }));
  });

  describe('redirectAfterLogin$', () => {
    it('should not navigate anywhere when no returnUrl is given', fakeAsync(() => {
      const action = new ua.LoginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.redirectAfterLogin$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toBeEmpty();
    }));

    it('should navigate to returnUrl after LoginUserSuccess when it is set', fakeAsync(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: '/foobar' } });
      tick(500);
      expect(location.path()).toEqual('/login?returnUrl=%2Ffoobar');

      const action = new ua.LoginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.redirectAfterLogin$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/foobar');
    }));
  });

  describe('createUser$', () => {
    it('should call the api service when Create event is called', done => {
      const action = new ua.CreateUser({
        customer: {
          type: 'SMBCustomer',
          customerNo: 'PC',
        },
      } as CustomerRegistrationType);

      actions$ = of(action);

      effects.createUser$.subscribe(() => {
        verify(userServiceMock.createUser(anything())).once();
        done();
      });
    });

    it('should dispatch a CreateUserLogin action on successful user creation', () => {
      const credentials: LoginCredentials = { login: '1234', password: 'xxx' };

      const action = new ua.CreateUser({ credentials } as CustomerRegistrationType);
      const completion = new ua.LoginUser({ credentials });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a CreateUserFail action on failed user creation', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.createUser(anything())).thenReturn(throwError(error));

      const action = new ua.CreateUser({} as CustomerRegistrationType);
      const completion = new ua.CreateUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });
  });

  describe('updateUser$', () => {
    beforeEach(() => {
      store$.dispatch(
        new ua.LoginUserSuccess({
          customer: {
            customerNo: '4711',
            type: 'PrivateCustomer',
          } as Customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when Update event is called', done => {
      const action = new ua.UpdateUser({
        user: {
          firstName: 'Patricia',
        } as User,
      });

      actions$ = of(action);

      effects.updateUser$.subscribe(() => {
        verify(userServiceMock.updateUser(anything())).once();
        done();
      });
    });

    it('should dispatch a UpdateUserSuccess action on successful user update', () => {
      const user = { firstName: 'Patricia' } as User;

      const action = new ua.UpdateUser({ user });
      const completion = new ua.UpdateUserSuccess({ user });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserFail action on failed user update', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.updateUser(anything())).thenReturn(throwError(error));

      const action = new ua.UpdateUser({ user: {} as User });
      const completion = new ua.UpdateUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });
  });

  describe('resetUserError$', () => {
    it('should not dispatch UserErrorReset action on router navigation if error is not set', () => {
      actions$ = hot('a', { a: new RouteNavigation({ path: 'any', params: {}, queryParams: {} }) });

      expect(effects.resetUserError$).toBeObservable(cold('-'));
    });

    it('should dispatch UserErrorReset action on router navigation if error was set', () => {
      store$.dispatch(new ua.LoginUserFail({ error: { message: 'error' } as HttpError }));

      actions$ = hot('a', { a: new RouteNavigation({ path: 'any', params: {}, queryParams: {} }) });

      expect(effects.resetUserError$).toBeObservable(cold('a', { a: new ua.UserErrorReset() }));
    });
  });

  describe('loadUserByAPIToken$', () => {
    it('should call the user service on LoadUserByAPIToken action and load user on success', done => {
      when(userServiceMock.signinUserByToken('dummy')).thenReturn(
        of({ user: { email: 'test@intershop.de' } } as CustomerUserType)
      );

      actions$ = of(new ua.LoadUserByAPIToken({ apiToken: 'dummy' }));

      effects.loadUserByAPIToken$.subscribe(action => {
        verify(userServiceMock.signinUserByToken('dummy')).once();
        expect(action.type).toEqual(ua.UserActionTypes.LoginUserSuccess);
        expect(action.payload).toHaveProperty('user.email', 'test@intershop.de');
        done();
      });
    });

    it('should call the user service on LoadUserByAPIToken action and do nothing when failing', () => {
      when(userServiceMock.signinUserByToken('dummy')).thenReturn(EMPTY);

      actions$ = hot('a-a-a-', { a: new ua.LoadUserByAPIToken({ apiToken: 'dummy' }) });

      expect(effects.loadUserByAPIToken$).toBeObservable(cold('------'));
    });
  });
});
