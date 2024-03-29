import { TestBed } from '@angular/core/testing';

import { Customer, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Product } from 'ish-core/models/product/product.model';
import { UserCostCenter } from 'ish-core/models/user-cost-center/user-cost-center.model';
import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  createUserApprovalRequired,
  loadCompanyUserSuccess,
  loadUserCostCentersSuccess,
  loadUserPaymentMethods,
  loadUserPaymentMethodsSuccess,
  loginUserFail,
  loginUserSuccess,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  updateUserPassword,
  userNewsletterApiActions,
} from './user.actions';
import {
  getCustomerApprovalEmail,
  getLoggedInCustomer,
  getLoggedInUser,
  getNewsletterSubscriptionStatus,
  getPasswordReminderError,
  getPasswordReminderSuccess,
  getPriceDisplayType,
  getUserAuthorized,
  getUserCostCenters,
  getUserError,
  getUserLoading,
  getUserPaymentMethods,
  isBusinessCustomer,
} from './user.selectors';

describe('User Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration', 'serverConfig']), CustomerStoreModule.forTesting('user')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    store$.dispatch(loadProductSuccess({ product: { sku: 'sku' } as Product }));
  });

  it('should select no customer/user when no event was sent', () => {
    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(isBusinessCustomer(store$.state)).toBeFalse();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserCostCenters(store$.state)).toBeUndefined();
    expect(getUserPaymentMethods(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeFalse();
    expect(getUserError(store$.state)).toBeFalsy();
    expect(getUserLoading(store$.state)).toBeFalsy();
  });

  it('should select the customer when logging in successfully', () => {
    const customerNo = 'PC';
    store$.dispatch(
      loginUserSuccess({
        customer: {
          isBusinessCustomer: true,
          customerNo,
        },
      } as CustomerUserType)
    );

    expect(getLoggedInCustomer(store$.state)).toHaveProperty('customerNo', customerNo);
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
    expect(getUserLoading(store$.state)).toBeFalsy();
  });

  it('should select the user when logging in as private customer successfully', () => {
    const firstName = 'test';
    const customerNo = 'PC';

    store$.dispatch(
      loginUserSuccess({
        customer: {
          customerNo,
          isBusinessCustomer: false,
        },
        user: {
          firstName,
        },
      } as CustomerUserType)
    );

    expect(getLoggedInCustomer(store$.state)).toHaveProperty('customerNo', customerNo);
    expect(getLoggedInCustomer(store$.state)).toHaveProperty('isBusinessCustomer', false);
    expect(isBusinessCustomer(store$.state)).toBeFalse();
    expect(getLoggedInUser(store$.state)).toHaveProperty('firstName', firstName);
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should not select the user when logging in as company customer successfully', () => {
    store$.dispatch(
      loginUserSuccess({
        customer: {
          customerNo: 'PC',
          isBusinessCustomer: true,
        },
      } as CustomerUserType)
    );

    expect(getLoggedInCustomer(store$.state)).toBeTruthy();
    expect(isBusinessCustomer(store$.state)).toBeTrue();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should select the user when load company user is successful', () => {
    const firstName = 'test';
    store$.dispatch(loadCompanyUserSuccess({ user: { firstName } as User }));

    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toHaveProperty('firstName', firstName);
    expect(getUserAuthorized(store$.state)).toBeFalse();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should select no customer and an error when an error event was sent', () => {
    const error = makeHttpError({ status: 401, code: 'dummy' });
    store$.dispatch(loginUserFail({ error }));

    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeFalse();

    const err = getUserError(store$.state);
    expect(err).toBeTruthy();
    expect(err.status).toEqual(401);
  });

  describe('loading payment methods', () => {
    beforeEach(() => {
      store$.dispatch(loadUserPaymentMethods());
    });
    it('should set the state to loading', () => {
      expect(getUserLoading(store$.state)).toBeTrue();
    });
    it('should select  cost centers when the user has cost centers', () => {
      store$.dispatch(loadUserCostCentersSuccess({ costCenters: [{ id: '12345' } as UserCostCenter] }));

      expect(getUserCostCenters(store$.state)).toHaveLength(1);
      expect(getUserLoading(store$.state)).toBeFalse();
    });
    it('should select  payment methods when the user has saved payment instruments', () => {
      store$.dispatch(loadUserPaymentMethodsSuccess({ paymentMethods: [{ id: 'ISH_CREDITCARD' } as PaymentMethod] }));

      expect(getUserPaymentMethods(store$.state)).toHaveLength(1);
      expect(getUserLoading(store$.state)).toBeFalse();
    });
  });

  it('should select loading when the user starts to update his password', () => {
    store$.dispatch(updateUserPassword({ password: '123', currentPassword: '1234' }));

    expect(getUserLoading(store$.state)).toBeTrue();
  });

  it('should be initial-state for password reminder when no event or reset was sent', () => {
    expect(getPasswordReminderError(store$.state)).toBeUndefined();
    expect(getPasswordReminderSuccess(store$.state)).toBeUndefined();
  });

  it('should loading on RequestPasswordReminder action', () => {
    const data: PasswordReminder = {
      email: 'patricia@test.intershop.de',
    };
    store$.dispatch(requestPasswordReminder({ data }));

    expect(getPasswordReminderError(store$.state)).toBeUndefined();
    expect(getPasswordReminderSuccess(store$.state)).toBeUndefined();
    expect(getUserLoading(store$.state)).toBeTrue();
  });

  it('should success on RequestPasswordReminderSuccess action', () => {
    store$.dispatch(requestPasswordReminderSuccess());
    expect(getPasswordReminderError(store$.state)).toBeUndefined();
    expect(getPasswordReminderSuccess(store$.state)).toBeTrue();
    expect(getUserLoading(store$.state)).toBeFalse();
  });

  it('should have error on PasswordReminderFail action', () => {
    const error = makeHttpError({ message: 'invalid' });
    store$.dispatch(requestPasswordReminderFail({ error }));
    expect(getPasswordReminderError(store$.state)).toMatchObject(error);
    expect(getPasswordReminderSuccess(store$.state)).toBeFalse();
    expect(getUserLoading(store$.state)).toBeFalse();
  });

  describe('getPriceDisplayType', () => {
    describe('without config', () => {
      it.each([
        ['gross', undefined],
        ['gross', { isBusinessCustomer: false } as Customer],
        ['net', { isBusinessCustomer: true } as Customer],
      ])('should be "%s" for user %o', (expected, customer: Customer) => {
        if (customer) {
          store$.dispatch(loginUserSuccess({ customer }));
        }
        expect(getPriceDisplayType(store$.state)).toEqual(expected);
      });
    });

    describe('B2C', () => {
      beforeEach(() => {
        store$.dispatch(
          loadServerConfigSuccess({
            config: {
              pricing: {
                defaultCustomerTypeForPriceDisplay: 'PRIVATE',
                privateCustomerPriceDisplayType: 'gross',
                smbCustomerPriceDisplayType: 'net',
              },
            },
          })
        );
      });

      it.each([
        ['gross', undefined],
        ['gross', { isBusinessCustomer: false } as Customer],
        ['net', { isBusinessCustomer: true } as Customer],
      ])('should be "%s" for user %o', (expected, customer: Customer) => {
        if (customer) {
          store$.dispatch(loginUserSuccess({ customer }));
        }
        expect(getPriceDisplayType(store$.state)).toEqual(expected);
      });
    });

    describe('B2B', () => {
      beforeEach(() => {
        store$.dispatch(
          loadServerConfigSuccess({
            config: {
              pricing: {
                defaultCustomerTypeForPriceDisplay: 'SMB',
                privateCustomerPriceDisplayType: 'gross',
                smbCustomerPriceDisplayType: 'net',
              },
            },
          })
        );
      });

      it.each([
        ['net', undefined],
        ['gross', { isBusinessCustomer: false } as Customer],
        ['net', { isBusinessCustomer: true } as Customer],
      ])('should be "%s" for user %o', (expected, customer: Customer) => {
        if (customer) {
          store$.dispatch(loginUserSuccess({ customer }));
        }
        expect(getPriceDisplayType(store$.state)).toEqual(expected);
      });
    });
  });

  describe('getCustomerApprovalEmail', () => {
    it('should be undefined if no createUserApprovalRequired action was triggert', () => {
      expect(getCustomerApprovalEmail(store$.state)).toBeUndefined();
    });

    it('should return the email address of the user to be approved', () => {
      const email = 'test@intershop.com';
      store$.dispatch(createUserApprovalRequired({ email }));
      expect(getCustomerApprovalEmail(store$.state)).toEqual(email);
    });
  });

  describe('getNewsletterSubscriptionStatus', () => {
    beforeEach(() => {
      store$.dispatch(
        loginUserSuccess({
          customer: {} as Customer,
          user: { email: 'test@interhop.com' } as User,
        })
      );
    });

    it('should be undefined if no action was triggered', () => {
      expect(getNewsletterSubscriptionStatus(store$.state)).toBeUndefined();
    });

    it('should return the current newsletter subscription status', () => {
      store$.dispatch(userNewsletterApiActions.loadUserNewsletterSubscriptionSuccess({ subscribed: true }));
      expect(getNewsletterSubscriptionStatus(store$.state)).toBeTrue();
    });

    it('should update the newsletter subscription status', () => {
      store$.dispatch(userNewsletterApiActions.updateUserNewsletterSubscriptionSuccess({ subscriptionStatus: false }));
      expect(getNewsletterSubscriptionStatus(store$.state)).toBeFalse();
    });
  });
});
