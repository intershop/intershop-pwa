import { Customer, CustomerType } from '../../../models/customer/customer.model';
import { HttpError, HttpHeader } from '../../../models/http-error/http-error.model';
import { User } from '../../../models/user/user.model';

import {
  LoadCompanyUserFail,
  LoadCompanyUserSuccess,
  LoginUser,
  LoginUserFail,
  LoginUserSuccess,
  LogoutUser,
  UserAction,
  UserErrorReset,
} from './user.actions';
import { initialState, userReducer } from './user.reducer';

describe('User Reducer', () => {
  const customer = {
    customerNo: 'dummy',
  } as Customer;
  const user = {
    firstName: 'test',
  } as User;

  describe('initialState', () => {
    it('should not have a customer when unmodified', () => {
      expect(initialState.customer).toBeUndefined();
    });

    it('should not have a user when unmodified', () => {
      expect(initialState.user).toBeUndefined();
    });

    it('should not have an error when unmodified', () => {
      expect(initialState.error).toBeFalsy();
    });

    it('should not be authorized when unmodified', () => {
      expect(initialState.authorized).toBeFalse();
    });
  });

  describe('reducer', () => {
    it('should return initial state when undefined state is supplied', () => {
      const newState = userReducer(undefined, {} as UserAction);

      expect(newState).toEqual(initialState);
    });

    it('should return initial state when undefined action is supplied', () => {
      const newState = userReducer(initialState, {} as UserAction);

      expect(newState).toEqual(initialState);
    });
  });

  describe('Actions', () => {
    it('should set initial state when LoginUser action is reduced', () => {
      const newState = userReducer(initialState, new LoginUser({ login: 'dummy', password: 'dummy' }));

      expect(newState).toEqual(initialState);
    });

    it('should set initial when LoginUser action is reduced', () => {
      const newState = userReducer(initialState, new LoginUser({ login: 'dummy', password: 'dummy' }));

      expect(newState).toEqual(initialState);
    });

    it('should set error when LoginUserFail action is reduced and error is resetted after reset action', () => {
      const error = { status: 500, headers: { 'error-key': 'error' } as HttpHeader } as HttpError;
      let newState = userReducer(initialState, new LoginUserFail(error));

      expect(newState).toEqual({ ...initialState, error });

      newState = userReducer(newState, new UserErrorReset());
      expect(newState.error).toBeUndefined();
    });

    it('should set error when CreateUserFail action is reduced', () => {
      const error = { status: 500, headers: { 'error-key': 'error' } as HttpHeader } as HttpError;
      const newState = userReducer(initialState, new LoginUserFail(error));

      expect(newState).toEqual({ ...initialState, error });
    });

    it('should set customer and authorized when LoginUserSuccess action is reduced', () => {
      const newState = userReducer(initialState, new LoginUserSuccess(customer));

      expect(newState).toEqual({ ...initialState, customer, authorized: true });
    });

    it('should set user when LoginUserSuccess action is reduced with type = PrivateCustomer', () => {
      const privateCustomer = {
        ...customer,
        type: 'PrivateCustomer' as CustomerType,
      };

      const newState = userReducer(initialState, new LoginUserSuccess(privateCustomer));

      expect(newState.customer).toEqual(privateCustomer);
      expect(newState.user).toEqual(privateCustomer as User);
      expect(newState.authorized).toBeTrue();
    });

    it('should set error when LoadCompanyUserFail action is reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new LoadCompanyUserFail(error);
      const state = userReducer(initialState, action);

      expect(state.error).toEqual(error);
    });

    it('should set user when LoadCompanyUserSuccess action is reduced', () => {
      const newState = userReducer(initialState, new LoadCompanyUserSuccess(user));

      expect(newState).toEqual({ ...initialState, user });
    });

    it('should unset authorized and customer when reducing LogoutUser', () => {
      const oldState = { ...initialState, customer, authorized: true };

      const newState = userReducer(oldState, new LogoutUser());

      expect(newState).toEqual({ ...initialState, customer: undefined, user: undefined, authorized: false });
    });

    it('should unset authorized and customer when reducing LoginUser', () => {
      const oldState = { ...initialState, customer, user, authorized: true };

      const newState = userReducer(oldState, new LoginUser({ login: 'dummy', password: 'dummy' }));

      expect(newState).toEqual({ ...initialState, customer: undefined, user: undefined, authorized: false });
    });
  });
});
