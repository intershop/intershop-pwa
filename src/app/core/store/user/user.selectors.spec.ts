import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, combineReducers } from '@ngrx/store';

import { CreateOrderSuccess } from '../../../checkout/store/basket';
import { checkoutReducers } from '../../../checkout/store/checkout.system';
import { Customer } from '../../../models/customer/customer.model';
import { HttpError, HttpHeader } from '../../../models/http-error/http-error.model';
import { Product } from '../../../models/product/product.model';
import { User } from '../../../models/user/user.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import { LogEffects } from '../../../utils/dev/log.effects';
import { coreReducers } from '../core.system';

import { LoadCompanyUserSuccess, LoginUserFail, LoginUserSuccess } from './user.actions';
import {
  getLoggedInCustomer,
  getLoggedInUser,
  getUserAuthorized,
  getUserError,
  getUserRecentOrder,
} from './user.selectors';

describe('User Selectors', () => {
  let store$: LogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
    store$.dispatch(new LoadProductSuccess({ sku: 'sku' } as Product));
  });

  it('should select no customer/user when no event was sent', () => {
    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeFalse();
    expect(getUserError(store$.state)).toBeFalsy();
    expect(getUserRecentOrder(store$.state)).toBeFalsy();
  });

  it('should select the customer when logging in successfully', () => {
    const customerNo = 'test';
    store$.dispatch(new LoginUserSuccess({ customerNo } as Customer));

    expect(getLoggedInCustomer(store$.state)).toHaveProperty('customerNo', customerNo);
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should select the user when logging in as private customer successfully', () => {
    const firstName = 'test';
    const type = 'PrivateCustomer';
    store$.dispatch(new LoginUserSuccess({ firstName, type } as Customer));

    expect(getLoggedInCustomer(store$.state)).toHaveProperty('firstName', firstName);
    expect(getLoggedInUser(store$.state)).toHaveProperty('firstName', firstName);
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should not select the user when logging in as company customer successfully', () => {
    const type = 'SMBCustomer';
    store$.dispatch(new LoginUserSuccess({ type } as Customer));

    expect(getLoggedInCustomer(store$.state)).toBeTruthy();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeTrue();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should select the user when load company user is successful', () => {
    const firstName = 'test';
    const type = 'PrivateCustomer';
    store$.dispatch(new LoadCompanyUserSuccess({ firstName, type } as User));

    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toHaveProperty('firstName', firstName);
    expect(getUserAuthorized(store$.state)).toBeFalse();
    expect(getUserError(store$.state)).toBeFalsy();
  });

  it('should select no customer and an error when an error event was sent', () => {
    const error = { status: 401, headers: { 'error-key': 'dummy' } as HttpHeader } as HttpError;
    store$.dispatch(new LoginUserFail(error));

    expect(getLoggedInCustomer(store$.state)).toBeUndefined();
    expect(getLoggedInUser(store$.state)).toBeUndefined();
    expect(getUserAuthorized(store$.state)).toBeFalse();

    const err = getUserError(store$.state);
    expect(err).toBeTruthy();
    expect(err.status).toEqual(401);
  });

  it('should select an order if a basket was submitted', () => {
    store$.dispatch(new CreateOrderSuccess(BasketMockData.getOrder()));
    expect(getUserRecentOrder(store$.state)).toHaveProperty('documentNo', '12345678');
  });
});
