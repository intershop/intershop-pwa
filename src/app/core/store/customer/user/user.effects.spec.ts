import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { User } from 'ish-core/models/user/user.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { UserService } from 'ish-core/services/user/user.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import {
  createUser,
  createUserApprovalRequired,
  createUserFail,
  createUserSuccess,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  fetchAnonymousUserToken,
  loadCompanyUser,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserByAPIToken,
  loadUserCostCenters,
  loadUserCostCentersFail,
  loadUserCostCentersSuccess,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUser,
  loginUserFail,
  loginUserSuccess,
  loginUserWithToken,
  logoutUser,
  logoutUserFail,
  logoutUserSuccess,
  postRegistrationProcessing,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  setAdditionalRegistrationData,
  updateCustomer,
  updateCustomerFail,
  updateCustomerSuccess,
  updateUser,
  updateUserFail,
  updateUserPassword,
  updateUserPasswordFail,
  updateUserPasswordSuccess,
  updateUserPreferredPayment,
  updateUserSuccess,
  userNewsletterActions,
} from './user.actions';
import { UserEffects } from './user.effects';

describe('User Effects', () => {
  let actions$: Observable<Action>;
  let effects: UserEffects;
  let store: Store;
  let userServiceMock: UserService;
  let paymentServiceMock: PaymentService;
  let apiTokenServiceMock: ApiTokenService;
  let oAuthServiceMock: OAuthService;
  let tokenServiceMock: TokenService;
  let router: Router;
  let location: Location;

  const loginResponseData = {
    customer: {
      isBusinessCustomer: true,
      customerNo: 'PC',
    },
    user: {},
  } as CustomerUserType;

  const customer = {
    customerNo: '4711',
    isBusinessCustomer: true,
  } as Customer;

  const token = {
    access_token: 'DEMO@access-token',
    token_type: 'user',
    expires_in: 3600,
    refresh_token: 'DEMO@refresh-token',
    id_token: 'DEMO@id-token',
  } as TokenResponse;

  beforeEach(() => {
    userServiceMock = mock(UserService);
    paymentServiceMock = mock(PaymentService);
    apiTokenServiceMock = mock(ApiTokenService);
    oAuthServiceMock = mock(OAuthService);
    tokenServiceMock = mock(TokenService);

    when(userServiceMock.signInUser(anything())).thenReturn(of(loginResponseData));
    when(tokenServiceMock.fetchToken(anyString(), anything())).thenReturn(of(token));
    when(tokenServiceMock.fetchToken(anyString())).thenReturn(of(token));
    when(userServiceMock.signInUserByToken(anything())).thenReturn(of(loginResponseData));
    when(userServiceMock.createUser(anything())).thenReturn(of(undefined));
    when(userServiceMock.updateUser(anything(), anything())).thenReturn(of({ firstName: 'Patricia' } as User));
    when(userServiceMock.updateUserPassword(anything(), anything(), anything(), anyString())).thenReturn(of(undefined));
    when(userServiceMock.updateCustomer(anything())).thenReturn(of(customer));
    when(userServiceMock.getCompanyUserData()).thenReturn(of({ firstName: 'Patricia' } as User));
    when(userServiceMock.requestPasswordReminder(anything())).thenReturn(of({}));
    when(userServiceMock.getEligibleCostCenters()).thenReturn(of([]));
    when(userServiceMock.logoutUser()).thenReturn(of(undefined));
    when(paymentServiceMock.getUserPaymentMethods(anything())).thenReturn(of([]));
    when(paymentServiceMock.createUserPayment(anything(), anything())).thenReturn(of({ id: 'paymentInstrumentId' }));
    when(paymentServiceMock.deleteUserPaymentInstrument(anyString(), anyString())).thenReturn(of(undefined));
    when(apiTokenServiceMock.hasUserApiTokenCookie()).thenReturn(false);
    when(oAuthServiceMock.events).thenReturn(of());

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router', 'serverConfig']),
        CustomerStoreModule.forTesting('user'),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
      ],
      providers: [
        { provide: ApiTokenService, useFactory: () => instance(apiTokenServiceMock) },
        { provide: PaymentService, useFactory: () => instance(paymentServiceMock) },
        { provide: TokenService, useFactory: () => instance(tokenServiceMock) },
        { provide: UserService, useFactory: () => instance(userServiceMock) },
        provideMockActions(() => actions$),
        UserEffects,
      ],
    });

    effects = TestBed.inject(UserEffects);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  describe('loginUser$', () => {
    it('should call the api service when LoginUser event is called', done => {
      const action = loginUser({ credentials: { login: 'dummy', password: 'dummy' } });

      actions$ = of(action);

      effects.loginUser$.subscribe(() => {
        verify(userServiceMock.signInUser(anything())).once();
        done();
      });
    });

    it('should call the api service when LoginUserWithToken event is called', done => {
      const action = loginUserWithToken({ token: '12345' });

      actions$ = of(action);

      effects.loginUserWithToken$.subscribe(() => {
        verify(userServiceMock.signInUserByToken(anything())).once();
        done();
      });
    });

    it('should dispatch a loadPGID action on successful login', () => {
      const action = loginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = loginUserSuccess(loginResponseData);

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loginUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoginUserFail action on failed login', () => {
      const error = makeHttpError({ status: 401, code: 'error' });

      when(userServiceMock.signInUser(anything())).thenReturn(throwError(() => error));

      const action = loginUser({ credentials: { login: 'dummy', password: 'dummy' } });
      const completion = loginUserFail({ error });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.loginUser$).toBeObservable(expected$);
    });
  });

  describe('loginUserWithToken$', () => {
    it('should call the api service when LoginUserWithToken event is called', done => {
      const action = loginUserWithToken({ token: '12345' });

      actions$ = of(action);

      effects.loginUserWithToken$.subscribe(() => {
        verify(userServiceMock.signInUserByToken(anything())).once();
        done();
      });
    });
  });

  describe('logoutUser$', () => {
    it('should call the api service to revoke current token when logoutUser action is called', done => {
      const action = logoutUser();

      actions$ = of(action);

      effects.logoutUser$.subscribe(() => {
        verify(userServiceMock.logoutUser()).once();
        done();
      });
    });

    it('should dispatch a success action on a successful request and should fetch a new anonymous user token', () => {
      const action = logoutUser();
      const completion = logoutUserSuccess();

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.logoutUser$).toBeObservable(expected$);
    });

    it('should dispatch an error action on a failed request', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(userServiceMock.logoutUser()).thenReturn(throwError(() => error));

      const action = logoutUser();
      const completion = logoutUserFail({ error });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: completion });

      expect(effects.logoutUser$).toBeObservable(expected$);
    });
  });

  describe('fetchAnonymousUserToken$', () => {
    it('should call apiTokenService with token response', done => {
      const action = fetchAnonymousUserToken();

      actions$ = of(action);

      effects.fetchAnonymousUserToken$.subscribe(() => {
        verify(tokenServiceMock.fetchToken('anonymous')).once();
        done();
      });
    });
  });

  describe('loadCompanyUser$', () => {
    it('should call the registration service for LoadCompanyUser', done => {
      const action = loadCompanyUser();
      actions$ = of(action);

      effects.loadCompanyUser$.subscribe(() => {
        verify(userServiceMock.getCompanyUserData()).once();
        done();
      });
    });
    it('should map to action of type LoadCompanyUserSuccess', () => {
      const action = loadCompanyUser();
      const completion = loadCompanyUserSuccess({ user: { firstName: 'Patricia' } as User });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });

    it('should dispatch a LoadCompanyUserFail action on failed for LoadCompanyUser', () => {
      const error = makeHttpError({ status: 401, code: 'field' });
      when(userServiceMock.getCompanyUserData()).thenReturn(throwError(() => error));

      const action = loadCompanyUser();
      const completion = loadCompanyUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadCompanyUser$).toBeObservable(expected$);
    });
  });

  describe('redirectAfterLogin$', () => {
    it('should not navigate anywhere when no returnUrl is given', fakeAsync(() => {
      const action = loginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.redirectAfterLogin$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(location.path()).toBeEmpty();
    }));

    it('should navigate to returnUrl after LoginUserSuccess when it is set', fakeAsync(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: '/foobar' } });
      tick(500);
      expect(location.path()).toEqual('/login?returnUrl=%2Ffoobar');

      const action = loginUserSuccess(loginResponseData);

      actions$ = of(action);

      effects.redirectAfterLogin$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(location.path()).toEqual('/foobar');
    }));

    it('should not navigate after LoginUserSuccess when user is logged in and somewhere else', fakeAsync(() => {
      router.navigate(['/home']);
      tick(500);
      expect(location.path()).toEqual('/home');

      store.dispatch(loginUserSuccess(loginResponseData));

      effects.redirectAfterLogin$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(location.path()).toEqual('/home');
    }));
  });

  describe('createUser$', () => {
    beforeEach(() => {
      store.dispatch(
        loadServerConfigSuccess({
          config: { general: { customerTypeForLoginApproval: ['PRIVATE'] } },
        })
      );
    });

    const customerLoginType = {
      customer: {
        isBusinessCustomer: true,
        customerNo: 'PC',
      },
      user: {
        email: 'test@intershop.de',
      } as User,
    };

    it('should call the api service when Create event is called', done => {
      const action = createUser({
        customer: {
          isBusinessCustomer: true,
          customerNo: 'PC',
        },
        user: {
          email: 'test@intershop.de',
        },
      } as CustomerRegistrationType);

      when(userServiceMock.createUser(anything())).thenReturn(of(customerLoginType));

      actions$ = of(action);

      effects.createUser$.subscribe(() => {
        verify(userServiceMock.createUser(anything())).once();
        done();
      });
    });

    it('should dispatch a createUserSuccess and a postRegistrationProcessing action on successful user creation', () => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const customer: Customer = { isBusinessCustomer: true, customerNo: 'PC' };

      when(userServiceMock.createUser(anything())).thenReturn(of(customerLoginType));

      const action = createUser({ customer, credentials } as CustomerRegistrationType);
      const completion1 = createUserSuccess({ email: customerLoginType.user.email });
      const completion2 = postRegistrationProcessing({
        isApprovalRequired: false,
        credentials,
        email: customerLoginType.user.email,
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(bc)', { b: completion1, c: completion2 });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a createUserSuccess and a postRegistrationProcessing action if customer approval is enabled', () => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const customer: Customer = { isBusinessCustomer: false, customerNo: 'PC' };

      const customerLoginType = {
        customer: {
          isBusinessCustomer: false,
          customerNo: 'PC',
        },
        user: {
          firstName: 'Klaus',
          lastName: 'Klausen',
          email: 'test@intershop.de',
        },
      };
      when(userServiceMock.createUser(anything())).thenReturn(of(customerLoginType));

      const action = createUser({ customer, credentials } as CustomerRegistrationType);
      const completion1 = createUserSuccess({ email: customerLoginType.user.email });
      const completion2 = postRegistrationProcessing({
        isApprovalRequired: true,
        credentials,
        email: customerLoginType.user.email,
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(bc)', { b: completion1, c: completion2 });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a subscribeUserToNewsletter action when the newsletter-subscription is checked', () => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const customer: Customer = { isBusinessCustomer: false, customerNo: 'PC' };

      when(userServiceMock.createUser(anything())).thenReturn(of(customerLoginType));

      const action = createUser({ customer, credentials, subscribedToNewsletter: true } as CustomerRegistrationType);
      const completion1 = createUserSuccess({ email: customerLoginType.user.email });
      const completion2 = userNewsletterActions.updateUserNewsletterSubscription({
        subscriptionStatus: true,
        userEmail: customerLoginType.user.email,
      });
      const completion3 = postRegistrationProcessing({
        isApprovalRequired: true,
        credentials,
        email: customerLoginType.user.email,
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(bcd)', { b: completion1, c: completion2, d: completion3 });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should dispatch a CreateUserFail action on failed user creation', () => {
      const error = makeHttpError({ status: 401, code: 'field' });
      when(userServiceMock.createUser(anything())).thenReturn(throwError(() => error));

      const action = createUser({} as CustomerRegistrationType);
      const completion = createUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.createUser$).toBeObservable(expected$);
    });

    it('should navigate to /register/approval if customer approval is needed', done => {
      actions$ = of(createUserApprovalRequired({ email: 'test@intershop.de' }));

      effects.redirectAfterUserCreationWithCustomerApproval$.subscribe({
        next: () => {
          expect(location.path()).toEqual('/register/approval');
          done();
        },
        error: fail,
        complete: noop,
      });
    });
  });

  describe('setAdditionalRegistrationData$', () => {
    it('should call the api service when Update event is called', done => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const customer: Customer = { isBusinessCustomer: false, customerNo: 'PC' };
      const action = setAdditionalRegistrationData({
        customer,
        credentials,
        isApprovalRequired: true,
        email: 'test@intershop.de',
      });

      when(userServiceMock.updateCustomerRegistration(anything(), anything())).thenReturn(of(customer));

      actions$ = of(action);

      effects.setAdditionalRegistrationData$.subscribe(() => {
        verify(userServiceMock.updateCustomerRegistration(anything(), anything())).once();
        done();
      });
    });

    it('should dispatch a updateCustomerFail action on failed customer update', () => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const customer: Customer = { isBusinessCustomer: false, customerNo: 'PC' };
      const error = makeHttpError({ status: 401, code: 'field' });
      when(userServiceMock.updateCustomerRegistration(anything(), anything())).thenReturn(throwError(() => error));

      const action = setAdditionalRegistrationData({
        customer,
        credentials,
        isApprovalRequired: true,
        email: 'test@intershop.de',
      });
      const completion = updateCustomerFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.setAdditionalRegistrationData$).toBeObservable(expected$);
    });

    it('should dispatch updateCustomerSuccess and postRegistrationProcessing when customer creation successful', fakeAsync(() => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const customer: Customer = { isBusinessCustomer: false, customerNo: 'PC' };
      const action = setAdditionalRegistrationData({
        customer,
        credentials,
        isApprovalRequired: true,
        email: 'test@intershop.de',
      });
      when(userServiceMock.updateCustomerRegistration(anything(), anything())).thenReturn(of(customer));

      const completion1 = updateCustomerSuccess({ customer });
      const completion2 = postRegistrationProcessing({
        isApprovalRequired: true,
        credentials,
        email: 'test@intershop.de',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(bc)', { b: completion1, c: completion2 });

      expect(effects.setAdditionalRegistrationData$).toBeObservable(expected$);
    }));
  });

  describe('postRegistrationProcessing$', () => {
    it('should dipatch loginUser when customer approval not necessary', fakeAsync(() => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const action = postRegistrationProcessing({
        isApprovalRequired: false,
        credentials,
        email: 'test@intershop.de',
      });

      const completion = loginUser({ credentials });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.postRegistrationProcessing$).toBeObservable(expected$);
    }));

    it('should dipatch createUserApprovalRequired when customer approval is necessary', fakeAsync(() => {
      const credentials: Credentials = { login: '1234', password: 'xxx' };
      const action = postRegistrationProcessing({
        isApprovalRequired: true,
        credentials,
        email: 'test@intershop.de',
      });

      const completion = createUserApprovalRequired({ email: 'test@intershop.de' });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.postRegistrationProcessing$).toBeObservable(expected$);
    }));
  });

  describe('updateUser$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer: {
            customerNo: '4711',
            isBusinessCustomer: false,
          } as Customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when Update event is called', done => {
      const action = updateUser({
        user: {
          firstName: 'Patricia',
        } as User,
      });

      actions$ = of(action);

      effects.updateUser$.subscribe(() => {
        verify(userServiceMock.updateUser(anything(), anything())).once();
        done();
      });
    });

    it('should dispatch a UpdateUserSuccess action on successful user update', () => {
      const user = { firstName: 'Patricia' } as User;

      const action = updateUser({ user, successMessage: { message: 'success' } });
      const completion = updateUserSuccess({ user, successMessage: { message: 'success' } });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });

    it('should dispatch a SuccessMessage action if update succeeded', () => {
      const action = updateUserSuccess({ user: {} as User, successMessage: { message: 'success' } });
      const completion = displaySuccessMessage({ message: 'success' });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: completion });

      expect(effects.displayUpdateUserSuccessMessage$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserFail action on failed user update', () => {
      const error = makeHttpError({ status: 401, code: 'field' });
      when(userServiceMock.updateUser(anything(), anything())).thenReturn(throwError(() => error));

      const action = updateUser({ user: {} as User });
      const completion = updateUserFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateUser$).toBeObservable(expected$);
    });
  });

  describe('updateUserPassword$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer: {
            customerNo: '4711',
            isBusinessCustomer: false,
          } as Customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when UpdateUserPassword is called', done => {
      const action = updateUserPassword({ password: '123', currentPassword: '1234' });

      actions$ = of(action);

      effects.updateUserPassword$.subscribe(() => {
        verify(userServiceMock.updateUserPassword(anything(), anything(), anyString(), anything())).once();
        done();
      });
    });

    it('should dispatch an UpdateUserPasswordSuccess action on successful user password update with the default success message', () => {
      const password = '123';
      const currentPassword = '1234';

      const action = updateUserPassword({ password, currentPassword });
      const completion = updateUserPasswordSuccess({
        successMessage: { message: 'account.profile.update_password.message' },
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateUserPassword$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserPasswordSuccess action on successful user password update with a given success message', () => {
      const password = '123';
      const currentPassword = '1234';

      const action = updateUserPassword({ password, currentPassword, successMessage: { message: 'success' } });
      const completion = updateUserPasswordSuccess({
        successMessage: { message: 'success' },
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateUserPassword$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateUserPasswordFail action on failed user password update', () => {
      when(userServiceMock.updateUserPassword(anything(), anything(), anything(), anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const password = '123';
      const currentPassword = '1234';
      const action = updateUserPassword({ password, currentPassword });
      const completion = updateUserPasswordFail({ error: makeHttpError({ message: 'invalid' }) });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateUserPassword$).toBeObservable(expected$);
    });
  });

  describe('updateCustomer$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });
    it('should call the api service when UpdateCustomer is called for a business customer', done => {
      const action = updateCustomer({
        customer: { ...customer, companyName: 'OilCorp' },
        successMessage: { message: 'success' },
      });

      actions$ = of(action);

      effects.updateCustomer$.subscribe(() => {
        verify(userServiceMock.updateCustomer(anything())).once();
        done();
      });
    });

    it('should dispatch an UpdateCustomerSuccess action on successful customer update', () => {
      const action = updateCustomer({ customer, successMessage: { message: 'success' } });
      const completion = updateCustomerSuccess({ customer, successMessage: { message: 'success' } });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateCustomer$).toBeObservable(expected$);
    });

    it('should not trigger any action if the customer is a private customer', () => {
      const privateCustomer = {
        customerNo: '4712',
        isBusinessCustomer: false,
      } as Customer;
      store.dispatch(
        loginUserSuccess({
          customer: privateCustomer,
          user: {} as User,
        })
      );

      const action = updateCustomer({ customer: privateCustomer, successMessage: { message: 'success' } });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('----');

      expect(effects.updateCustomer$).toBeObservable(expected$);
    });

    it('should dispatch an UpdateCustomerFail action on failed company update', () => {
      when(userServiceMock.updateCustomer(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = updateCustomer({ customer });
      const completion = updateCustomerFail({ error: makeHttpError({ message: 'invalid' }) });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateCustomer$).toBeObservable(expected$);
    });
  });

  describe('resetUserError$', () => {
    it('should not dispatch UserErrorReset action on router navigation if error is not set', fakeAsync(() => {
      router.navigateByUrl('/any');

      effects.resetUserError$.subscribe({ next: fail, error: fail, complete: fail });

      tick(2000);
    }));

    it('should dispatch UserErrorReset action on router navigation if error was set', done => {
      store.dispatch(loginUserFail({ error: makeHttpError({ message: 'error' }) }));

      actions$ = of(routerTestNavigatedAction({}));

      effects.resetUserError$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[User Internal] Reset User Error`);
        done();
      });
    });
  });

  describe('loadUserByAPIToken$', () => {
    it('should call the user service on LoadUserByAPIToken action and set pgid on success', done => {
      when(userServiceMock.signInUserByToken()).thenReturn(
        of({ user: { email: 'test@intershop.de' } } as CustomerUserType)
      );

      actions$ = of(loadUserByAPIToken());

      effects.loadUserByAPIToken$.subscribe(action => {
        verify(userServiceMock.signInUserByToken()).once();
        expect(action).toMatchInlineSnapshot(`
          [User API] Login User Success:
            user: {"email":"test@intershop.de"}
        `);
        done();
      });
    });

    it('should call the user service on LoadUserByAPIToken action and do nothing when failing', () => {
      when(userServiceMock.signInUserByToken()).thenReturn(EMPTY);

      actions$ = hot('a-a-a-', { a: loadUserByAPIToken() });

      expect(effects.loadUserByAPIToken$).toBeObservable(cold('------'));
    });
  });

  describe('loadUserCostCenters$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer: {
            isBusinessCustomer: true,
            customerNo: 'pmiller',
          },
          user: { login: 'patricia' } as User,
        })
      );
    });

    it('should call the api service when loadUserCostCenters event is called', done => {
      const action = loadUserCostCenters();
      actions$ = of(action);
      effects.loadUserCostCenters$.subscribe(() => {
        verify(userServiceMock.getEligibleCostCenters()).once();
        done();
      });
    });

    it('should dispatch a loadUserCostCentersSuccess action on successful', () => {
      const action = loadUserCostCenters();
      const completion = loadUserCostCentersSuccess({ costCenters: [] });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: completion });

      expect(effects.loadUserCostCenters$).toBeObservable(expected$);
    });

    it('should dispatch a loadUserCostCentersFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(userServiceMock.getEligibleCostCenters()).thenReturn(throwError(() => error));

      const action = loadUserCostCenters();
      const completion = loadUserCostCentersFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.loadUserCostCenters$).toBeObservable(expected$);
    });
  });

  describe('loadUserPaymentMethods$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });

    it('should call the api service when LoadUserPaymentMethods event is called', done => {
      const action = loadUserPaymentMethods();
      actions$ = of(action);
      effects.loadUserPaymentMethods$.subscribe(() => {
        verify(paymentServiceMock.getUserPaymentMethods(anything())).once();
        done();
      });
    });

    it('should dispatch a LoadUserPaymentMethodsSuccess action on successful', () => {
      const action = loadUserPaymentMethods();
      const completion = loadUserPaymentMethodsSuccess({ paymentMethods: [] });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b', { b: completion });

      expect(effects.loadUserPaymentMethods$).toBeObservable(expected$);
    });

    it('should dispatch a LoadUserPaymentMethodsFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(paymentServiceMock.getUserPaymentMethods(anything())).thenReturn(throwError(() => error));

      const action = loadUserPaymentMethods();
      const completion = loadUserPaymentMethodsFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.loadUserPaymentMethods$).toBeObservable(expected$);
    });
  });

  describe('deleteUserPayment$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });

    it('should call the api service when DeleteUserPayment event is called', done => {
      const action = deleteUserPaymentInstrument({ id: 'paymentInstrumentId' });
      actions$ = of(action);
      effects.deleteUserPayment$.subscribe(() => {
        verify(paymentServiceMock.deleteUserPaymentInstrument(customer.customerNo, 'paymentInstrumentId')).once();
        done();
      });
    });

    it('should dispatch a DeleteUserPaymentSuccess action on successful', () => {
      const action = deleteUserPaymentInstrument({
        id: 'paymentInstrumentId',
        successMessage: { message: 'account.payment.payment_deleted.message' },
      });
      const completion1 = deleteUserPaymentInstrumentSuccess();
      const completion2 = loadUserPaymentMethods();
      const completion3 = displaySuccessMessage({
        message: 'account.payment.payment_deleted.message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.deleteUserPayment$).toBeObservable(expected$);
    });

    it('should dispatch a DeleteUserPaymentFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(paymentServiceMock.deleteUserPaymentInstrument(anyString(), anyString())).thenReturn(
        throwError(() => error)
      );

      const action = deleteUserPaymentInstrument({ id: 'paymentInstrumentId' });
      const completion = deleteUserPaymentInstrumentFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.deleteUserPayment$).toBeObservable(expected$);
    });
  });

  describe('updatePreferredUserPayment$', () => {
    beforeEach(() => {
      store.dispatch(
        loginUserSuccess({
          customer,
          user: {} as User,
        })
      );
    });

    it('should call the payment service when UpdateUserPreferredPayment event is called', done => {
      const action = updateUserPreferredPayment({ user: {} as User, paymentMethodId: 'paymentInstrumentId' });
      actions$ = of(action);
      effects.updatePreferredUserPayment$.subscribe(() => {
        verify(paymentServiceMock.createUserPayment(customer.customerNo, anything())).once();
        done();
      });
    });

    it('should dispatch a UpdateUser action on successful payment instrument creation', () => {
      const action = updateUserPreferredPayment({
        user: {} as User,
        paymentMethodId: 'paymentInstrumentId',
      });
      const completion1 = updateUser({ user: { preferredPaymentInstrumentId: 'paymentInstrumentId' } as User });
      const completion2 = loadUserPaymentMethods();

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.updatePreferredUserPayment$).toBeObservable(expected$);
    });

    it('should dispatch a UpdateUserFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(paymentServiceMock.createUserPayment(anything(), anything())).thenReturn(throwError(() => error));

      const action = updateUserPreferredPayment({
        user: {} as User,
        paymentMethodId: 'paymentInstrumentId',
      });
      const completion = updateUserFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.updatePreferredUserPayment$).toBeObservable(expected$);
    });
  });

  describe('requestPasswordReminder$', () => {
    const data: PasswordReminder = {
      email: 'patricia@test.intershop.de',
    };

    it('should call the api service when RequestPasswordReminder event is called', done => {
      const action = requestPasswordReminder({ data });
      actions$ = of(action);
      effects.requestPasswordReminder$.subscribe(() => {
        verify(userServiceMock.requestPasswordReminder(anything())).once();
        done();
      });
    });

    it('should dispatch a RequestPasswordReminderSuccess action on successful', () => {
      const action = requestPasswordReminder({ data });
      const completion = requestPasswordReminderSuccess();

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.requestPasswordReminder$).toBeObservable(expected$);
    });

    it('should dispatch a RequestPasswordReminderFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(userServiceMock.requestPasswordReminder(anything())).thenReturn(throwError(() => error));

      const action = requestPasswordReminder({ data });
      const completion = requestPasswordReminderFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.requestPasswordReminder$).toBeObservable(expected$);
    });
  });

  describe('redirectAfterUpdateOnProfileSettings$', () => {
    describe('on profile edit', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/account/profile/edit');
        tick(500);
      }));

      it.each([updateUserSuccess.type, updateUserPasswordSuccess.type, updateCustomerSuccess.type])(
        'should navigate to profile page after %s',
        fakeAsync((type: string) => {
          actions$ = of({ type });
          effects.redirectAfterUpdateOnProfileSettings$.subscribe({ next: noop, error: fail, complete: noop });
          tick(500);

          expect(location.path()).toEqual('/account/profile');
        })
      );
    });

    describe('on different page', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/any');
        tick(500);
      }));

      it.each([updateUserSuccess.type, updateUserPasswordSuccess.type, updateCustomerSuccess.type])(
        'should not navigate to profile page after %s',
        fakeAsync((type: string) => {
          actions$ = of({ type });
          effects.redirectAfterUpdateOnProfileSettings$.subscribe({ next: noop, error: fail, complete: noop });
          tick(500);

          expect(location.path()).toEqual('/any');
        })
      );
    });
  });
});
