import { Location } from '@angular/common';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { EMPTY, Observable, from, noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { HttpErrorMapper } from 'ish-core/models/http-error/http-error.mapper';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { User } from 'ish-core/models/user/user.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { PersonalizationService } from 'ish-core/services/personalization/personalization.service';
import { UserService } from 'ish-core/services/user/user.service';
import { AccountStoreModule } from 'ish-core/store/account/account-store.module';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { SuccessMessage } from 'ish-core/store/core/messages';

import {
  CreateUser,
  CreateUserFail,
  DeleteUserPaymentInstrument,
  DeleteUserPaymentInstrumentFail,
  DeleteUserPaymentInstrumentSuccess,
  LoadCompanyUser,
  LoadCompanyUserFail,
  LoadCompanyUserSuccess,
  LoadUserByAPIToken,
  LoadUserPaymentMethods,
  LoadUserPaymentMethodsFail,
  LoadUserPaymentMethodsSuccess,
  LoginUser,
  LoginUserFail,
  LoginUserSuccess,
  LogoutUser,
  RequestPasswordReminder,
  RequestPasswordReminderFail,
  RequestPasswordReminderSuccess,
  ResetAPIToken,
  UpdateCustomer,
  UpdateCustomerFail,
  UpdateCustomerSuccess,
  UpdateUser,
  UpdateUserFail,
  UpdateUserPassword,
  UpdateUserPasswordFail,
  UpdateUserPasswordSuccess,
  UpdateUserSuccess,
} from './user.actions';
import { UserEffects } from './user.effects';

describe('User Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let store$: Store;
  let userServiceMock: UserService;
  let paymentServiceMock: PaymentService;
  let router: Router;
  let location: Location;

  const loginResponseData = {
    customer: {
      type: 'SMBCustomer',
      customerNo: 'PC',
    },
    user: {},
  } as CustomerUserType;

  @Component({ template: 'dummy' })
  class DummyComponent {}
  const customer = {
    customerNo: '4711',
    type: 'SMBCustomer',
    isBusinessCustomer: true,
  } as Customer;

  beforeEach(() => {
    userServiceMock = mock(UserService);
    paymentServiceMock = mock(PaymentService);
    when(userServiceMock.signinUser(anything())).thenReturn(of(loginResponseData));
    when(userServiceMock.createUser(anything())).thenReturn(of(undefined));
    when(userServiceMock.updateUser(anything())).thenReturn(of({ firstName: 'Patricia' } as User));
    when(userServiceMock.updateUserPassword(anything(), anything(), anything(), anyString())).thenReturn(of(undefined));
    when(userServiceMock.updateCustomer(anything())).thenReturn(of(customer));
    when(userServiceMock.getCompanyUserData()).thenReturn(of({ firstName: 'Patricia' } as User));
    when(userServiceMock.requestPasswordReminder(anything())).thenReturn(of({}));
    when(paymentServiceMock.getUserPaymentMethods(anything())).thenReturn(of([]));
    when(paymentServiceMock.deleteUserPaymentInstrument(anyString(), anyString())).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        AccountStoreModule.forTesting('user'),
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'home', component: DummyComponent },
          { path: 'account', component: DummyComponent },
          { path: 'account/profile', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
      ],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useFactory: () => instance(userServiceMock) },
        { provide: PaymentService, useFactory: () => instance(paymentServiceMock) },
        { provide: PersonalizationService, useFactory: () => instance(mock(PersonalizationService)) },
      ],
    });

    effects = TestBed.inject(UserEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', done => {
      const action = new LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });

      actions$ = of(action);

      effects.loginUser$.subscribe(() => {
        verify(userServiceMock.signinUser(anything())).once();
        done();
      });
    });

    it('should dispatch a LoginUserSuccess action on successful login', () => {
      const action = new LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = new LoginUserSuccess(loginResponseData);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(userServiceMock.signinUser(anything())).thenReturn(throwError(error));

      const action = new LoginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = new LoginUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.loginUser$).toBeObservable(expected$);
    });
  });

  describe('loadCompanyUser$', () => {
    it('should call the registationService for LoadCompanyUser', done => {
      const action = new LoadCompanyUser();
      actions$ = of(action);

      effects.loadCompanyUser$.subscribe(() => {
        verify(userServiceMock.getCompanyUserData()).once();
        done();
      });
    });
    it('should map to action of type LoadCompanyUserSuccess', () => {
      const action = new LoadCompanyUser();
      const completion = new LoadCompanyUserSuccess({ user: { firstName: 'Patricia' } as User });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoadCompanyUserFail action on failed for LoadCompanyUser', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.getCompanyUserData()).thenReturn(throwError(error));

      const action = new LoadCompanyUser();
      const completion = new LoadCompanyUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });
  });

  describe('goToLoginAfterLogoutBySessionTimeout$', () => {
    it('should navigate to login from current route after ResetAPIToken', fakeAsync(() => {
      store$.dispatch(new LoginUserSuccess(loginResponseData));
      router.navigateByUrl('/account');
      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/account"`);

      actions$ = from([new ResetAPIToken(), new LogoutUser()]);

      effects.goToLoginAfterLogoutBySessionTimeout$.subscribe(noop, fail, noop);

      tick(5000);

      expect(location.path()).toMatchInlineSnapshot(`"/login?returnUrl=%2Faccount&messageKey=session_timeout"`);
    }));
  });

  describe('redirectAfterLogin$', () => {
    it('should not navigate anywhere when no returnUrl is given', fakeAsync(() => {
      const action = new LoginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.redirectAfterLogin$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toBeEmpty();
    }));

    it('should navigate to returnUrl after LoginUserSuccess when it is set', fakeAsync(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: '/foobar' } });
      tick(500);
      expect(location.path()).toEqual('/login?returnUrl=%2Ffoobar');

      const action = new LoginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.redirectAfterLogin$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/foobar');
    }));

    it('should navigate to /account after LoginUserSuccess when no returnUrl is set and user is at login', fakeAsync(() => {
      router.navigate(['/login']);
      tick(500);
      expect(location.path()).toEqual('/login');

      store$.dispatch(new LoginUserSuccess(loginResponseData));

      effects.redirectAfterLogin$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/account');
    }));

    it('should not navigate after LoginUserSuccess when user is logged in and somewhere else', fakeAsync(() => {
      router.navigate(['/home']);
      tick(500);
      expect(location.path()).toEqual('/home');

      store$.dispatch(new LoginUserSuccess(loginResponseData));

      effects.redirectAfterLogin$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/home');
    }));
  });

  describe('createUser$', () => {
    it('should call the api service when Create event is called', done => {
      const action = new CreateUser({
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
      const credentials: Credentials = { login: '1234', password: 'xxx' };

      const action = new CreateUser({ credentials } as CustomerRegistrationType);
      const completion = new LoginUser({ credentials });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a CreateUserFail action on failed user creation', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.createUser(anything())).thenReturn(throwError(error));

      const action = new CreateUser({} as CustomerRegistrationType);
      const completion = new CreateUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });
  });

  describe('updateUser$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoginUserSuccess({
          customer: {
            customerNo: '4711',
            type: 'PrivateCustomer',
          } as Customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when Update event is called', done => {
      const action = new UpdateUser({
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

      const action = new UpdateUser({ user, successMessage: 'success' });
      const completion = new UpdateUserSuccess({ user, successMessage: 'success' });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });

    it('should dispatch a SuccessMessage action if update succeeded', () => {
      // tslint:disable-next-line:ban-types

      const action = new UpdateUserSuccess({ user: {} as User, successMessage: 'success' });
      const completion = new SuccessMessage({ message: 'success' });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: completion });

      expect(effects.displayUpdateUserSuccessMessage$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserFail action on failed user update', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 401, headers: new HttpHeaders().set('error-key', 'feld') } as HttpErrorResponse;
      when(userServiceMock.updateUser(anything())).thenReturn(throwError(error));

      const action = new UpdateUser({ user: {} as User });
      const completion = new UpdateUserFail({ error: HttpErrorMapper.fromError(error) });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });
  });

  describe('updateUserPassword$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoginUserSuccess({
          customer: {
            customerNo: '4711',
            type: 'PrivateCustomer',
          } as Customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when UpdateUserPassword is called', done => {
      const action = new UpdateUserPassword({ password: '123', currentPassword: '1234' });

      actions$ = of(action);

      effects.updateUserPassword$.subscribe(() => {
        verify(userServiceMock.updateUserPassword(anything(), anything(), anyString(), anything())).once();
        done();
      });
    });

    it('should dispatch an UpdateUserPasswordSuccess action on successful user password update with the default success message', () => {
      const password = '123';
      const currentPassword = '1234';

      const action = new UpdateUserPassword({ password, currentPassword });
      const completion = new UpdateUserPasswordSuccess({
        successMessage: 'account.profile.update_password.message',
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateUserPassword$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserPasswordSuccess action on successful user password update with a given success message', () => {
      const password = '123';
      const currentPassword = '1234';

      const action = new UpdateUserPassword({ password, currentPassword, successMessage: 'success' });
      const completion = new UpdateUserPasswordSuccess({
        successMessage: 'success',
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateUserPassword$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserPasswordFail action on failed user password update', () => {
      when(userServiceMock.updateUserPassword(anything(), anything(), anything(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const password = '123';
      const currentPassword = '1234';
      const action = new UpdateUserPassword({ password, currentPassword });
      const completion = new UpdateUserPasswordFail({ error: { message: 'invalid' } as HttpError });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateUserPassword$).toBeObservable(expected$);
    });
  });

  describe('updateCustomer$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when UpdateCustomer is called for a business customer', done => {
      const action = new UpdateCustomer({
        customer: { ...customer, companyName: 'OilCorp' },
        successMessage: 'success',
      });

      actions$ = of(action);

      effects.updateCustomer$.subscribe(() => {
        verify(userServiceMock.updateCustomer(anything())).once();
        done();
      });
    });

    it('should dispatch an UpdateCustomerSuccess action on successful customer update', () => {
      const action = new UpdateCustomer({ customer, successMessage: 'success' });
      const completion = new UpdateCustomerSuccess({ customer, successMessage: 'success' });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateCustomer$).toBeObservable(expected$);
    });

    it('should not trigger any action if the customer is a private customer', () => {
      const privateCustomer = {
        customerNo: '4712',
        isBusinessCustomer: false,
        type: 'PrivateCustomer',
      } as Customer;
      store$.dispatch(
        new LoginUserSuccess({
          customer: privateCustomer,
          user: {} as User,
        })
      );

      const action = new UpdateCustomer({ customer: privateCustomer, successMessage: 'success' });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('----');

      expect(effects.updateCustomer$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateCustomerFail action on failed company update', () => {
      when(userServiceMock.updateCustomer(anything())).thenReturn(throwError({ message: 'invalid' }));

      const action = new UpdateCustomer({ customer });
      const completion = new UpdateCustomerFail({ error: { message: 'invalid' } as HttpError });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateCustomer$).toBeObservable(expected$);
    });
  });

  describe('resetUserError$', () => {
    it('should not dispatch UserErrorReset action on router navigation if error is not set', done => {
      router.navigateByUrl('/any');

      effects.resetUserError$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should dispatch UserErrorReset action on router navigation if error was set', done => {
      store$.dispatch(new LoginUserFail({ error: { message: 'error' } as HttpError }));

      // tslint:disable-next-line: no-any
      actions$ = of(routerNavigatedAction({ payload: {} as any }));

      effects.resetUserError$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Account Internal] Reset User Error`);
        done();
      });
    });
  });

  describe('loadUserByAPIToken$', () => {
    it('should call the user service on LoadUserByAPIToken action and load user on success', done => {
      when(userServiceMock.signinUserByToken('dummy')).thenReturn(
        of({ user: { email: 'test@intershop.de' } } as CustomerUserType)
      );

      actions$ = of(new LoadUserByAPIToken({ apiToken: 'dummy' }));

      effects.loadUserByAPIToken$.subscribe(action => {
        verify(userServiceMock.signinUserByToken('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Account API] Login User Success:
            user: {"email":"test@intershop.de"}
        `);
        done();
      });
    });

    it('should call the user service on LoadUserByAPIToken action and do nothing when failing', () => {
      when(userServiceMock.signinUserByToken('dummy')).thenReturn(EMPTY);

      actions$ = hot('a-a-a-', { a: new LoadUserByAPIToken({ apiToken: 'dummy' }) });

      expect(effects.loadUserByAPIToken$).toBeObservable(cold('------'));
    });
  });

  describe('loadUserPaymentMethods$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });

    it('should call the api service when LoadUserPaymentMethods event is called', done => {
      const action = new LoadUserPaymentMethods();
      actions$ = of(action);
      effects.loadUserPaymentMethods$.subscribe(() => {
        verify(paymentServiceMock.getUserPaymentMethods(anything())).once();
        done();
      });
    });

    it('should dispatch a LoadUserPaymentMethodsSuccess action on successful', () => {
      const action = new LoadUserPaymentMethods();
      const completion = new LoadUserPaymentMethodsSuccess({ paymentMethods: [] });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: completion });

      expect(effects.loadUserPaymentMethods$).toBeObservable(expected$);
    });

    it('should dispatch a LoadUserPaymentMethodsFail action on failed', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 400, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(paymentServiceMock.getUserPaymentMethods(anything())).thenReturn(throwError(error));

      const action = new LoadUserPaymentMethods();
      const completion = new LoadUserPaymentMethodsFail({
        error: HttpErrorMapper.fromError(error),
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.loadUserPaymentMethods$).toBeObservable(expected$);
    });
  });

  describe('deleteUserPayment$', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });

    it('should call the api service when DeleteUserPayment event is called', done => {
      const action = new DeleteUserPaymentInstrument({ id: 'paymentInstrumentId' });
      actions$ = of(action);
      effects.deleteUserPayment$.subscribe(() => {
        verify(paymentServiceMock.deleteUserPaymentInstrument(customer.customerNo, 'paymentInstrumentId')).once();
        done();
      });
    });

    it('should dispatch a DeleteUserPaymentSuccess action on successful', () => {
      const action = new DeleteUserPaymentInstrument({ id: 'paymentInstrumentId' });
      const completion1 = new DeleteUserPaymentInstrumentSuccess();
      const completion2 = new LoadUserPaymentMethods();
      const completion3 = new SuccessMessage({
        message: 'account.payment.payment_deleted.message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.deleteUserPayment$).toBeObservable(expected$);
    });

    it('should dispatch a DeleteUserPaymentFail action on failed', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 400, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(paymentServiceMock.deleteUserPaymentInstrument(anyString(), anyString())).thenReturn(throwError(error));

      const action = new DeleteUserPaymentInstrument({ id: 'paymentInstrumentId' });
      const completion = new DeleteUserPaymentInstrumentFail({
        error: HttpErrorMapper.fromError(error),
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.deleteUserPayment$).toBeObservable(expected$);
    });
  });
  describe('requestPasswordReminder$', () => {
    const data: PasswordReminder = {
      email: 'patricia@test.intershop.de',
      firstName: 'Patricia',
      lastName: 'Miller',
    };

    it('should call the api service when RequestPasswordReminder event is called', done => {
      const action = new RequestPasswordReminder({ data });
      actions$ = of(action);
      effects.requestPasswordReminder$.subscribe(() => {
        verify(userServiceMock.requestPasswordReminder(anything())).once();
        done();
      });
    });

    it('should dispatch a RequestPasswordReminderSuccess action on successful', () => {
      const action = new RequestPasswordReminder({ data });
      const completion = new RequestPasswordReminderSuccess();

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.requestPasswordReminder$).toBeObservable(expected$);
    });

    it('should dispatch a RequestPasswordReminderFail action on failed', () => {
      // tslint:disable-next-line:ban-types
      const error = { status: 400, headers: new HttpHeaders().set('error-key', 'error') } as HttpErrorResponse;

      when(userServiceMock.requestPasswordReminder(anything())).thenReturn(throwError(error));

      const action = new RequestPasswordReminder({ data });
      const completion = new RequestPasswordReminderFail({
        error: HttpErrorMapper.fromError(error),
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.requestPasswordReminder$).toBeObservable(expected$);
    });
  });
});
