import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { CustomerUserType } from '../../models/customer/customer.model';
import { HttpError, HttpHeader } from '../../models/http-error/http-error.model';
import { Product } from '../../models/product/product.model';
import { User } from '../../models/user/user.model';
import { checkoutReducers } from '../checkout/checkout-store.module';
import { coreReducers } from '../core-store.module';
import { LoadProductSuccess } from '../shopping/products';
import { shoppingReducers } from '../shopping/shopping-store.module';

import {
  LoadCompanyUserSuccess,
  LoginUserFail,
  LoginUserSuccess,
  UpdateUserPassword,
  UpdateUserPasswordSuccess,
} from './user.actions';
import {
  getLoggedInCustomer,
  getLoggedInUser,
  getUserAuthorized,
  getUserError,
  getUserLoading,
  getUserSuccessMessage,
  isBusinessCustomer,
} from './user.selectors';

describe('User Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        ...coreReducers,
        checkout: combineReducers(checkoutReducers),
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
    store$.dispatch(new LoadProductSuccess({ product: { sku: 'sku' } as Product }));
  });

  it('should select no customer/user when no event was sent', () => {
    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(isBusinessCustomer(store$.state)).toBeFalse();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeFalse();
    expect(getUserError(store$.state)).toBeFalsy();
    expect(getUserLoading(store$.state)).toBeFalsy();
    expect(getUserSuccessMessage(store$.state)).toBeUndefined();
  });

  it('should select the customer when logging in successfully', () => {
    const customerNo = 'PC';
    store$.dispatch(
      new LoginUserSuccess({
        customer: {
          type: 'SMBCustomer',
          customerNo,
        },
      } as CustomerUserType)
    );

    expect(getLoggedInCustomer(store$.state)).toHaveProperty('customerNo', customerNo);
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
    expect(getUserLoading(store$.state)).toBeFalsy();
    expect(getUserSuccessMessage(store$.state)).toBeUndefined();
  });

  it('should select the user when logging in as private customer successfully', () => {
    const firstName = 'test';
    const customerNo = 'PC';
    const type = 'PrivateCustomer';
    store$.dispatch(
      new LoginUserSuccess({
        customer: {
          type,
          customerNo,
          isBusinessCustomer: false,
        },
        user: {
          firstName,
        },
      } as CustomerUserType)
    );

    expect(getLoggedInCustomer(store$.state)).toHaveProperty('customerNo', customerNo);
    expect(getLoggedInCustomer(store$.state)).toHaveProperty('type', type);
    expect(getLoggedInCustomer(store$.state)).toHaveProperty('isBusinessCustomer', false);
    expect(isBusinessCustomer(store$.state)).toBeFalse();
    expect(getLoggedInUser(store$.state)).toHaveProperty('firstName', firstName);
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should not select the user when logging in as company customer successfully', () => {
    store$.dispatch(
      new LoginUserSuccess({
        customer: {
          type: 'SMBCustomer',
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
    store$.dispatch(new LoadCompanyUserSuccess({ user: { firstName } as User }));

    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toHaveProperty('firstName', firstName);
    expect(getUserAuthorized(store$.state)).toBeFalse();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should select no customer and an error when an error event was sent', () => {
    const error = { status: 401, headers: { 'error-key': 'dummy' } as HttpHeader } as HttpError;
    store$.dispatch(new LoginUserFail({ error }));

    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeFalse();

    const err = getUserError(store$.state);
    expect(err).toBeTruthy();
    expect(err.status).toEqual(401);
  });

  it('should select loading when the user starts to update his password', () => {
    store$.dispatch(new UpdateUserPassword({ password: '123', currentPassword: '1234' }));

    expect(getUserLoading(store$.state)).toBeTrue();
  });

  it('should select update success message when the user updated his password', () => {
    store$.dispatch(new UpdateUserPasswordSuccess({ successMessage: 'success' }));

    expect(getUserSuccessMessage(store$.state)).toBe('success');
    expect(getUserLoading(store$.state)).toBeFalse();
  });
});
