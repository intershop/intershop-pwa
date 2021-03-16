import { Action } from '@ngrx/store';

import { Customer } from 'ish-core/models/customer/customer.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  createUserFail,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUserFail,
  loginUserSuccess,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  resetPasswordReminder,
  updateCustomer,
  updateCustomerFail,
  updateCustomerSuccess,
  updateUser,
  updateUserFail,
  updateUserPassword,
  updateUserPasswordFail,
  updateUserPasswordSuccess,
  updateUserSuccess,
  userErrorReset,
} from './user.actions';
import { initialState, userReducer } from './user.reducer';

describe('User Reducer', () => {
  const customer = {
    customerNo: 'dummy',
    isBusinessCustomer: false,
  } as Customer;
  const user = {
    firstName: 'Patricia',
  } as User;

  describe('initialState', () => {
    it('should not have a customer when unmodified', () => {
      expect(initialState.customer).toBeUndefined();
    });

    it('should not have a user when unmodified', () => {
      expect(initialState.user).toBeUndefined();
    });

    it('should not have payment methods when unmodified', () => {
      expect(initialState.paymentMethods).toBeUndefined();
    });

    it('should not have an error when unmodified', () => {
      expect(initialState.error).toBeFalsy();
    });

    it('should not be in loading mode when unmodified', () => {
      expect(initialState.loading).toBeFalse();
    });

    it('should not be authorized when unmodified', () => {
      expect(initialState.authorized).toBeFalse();
    });
  });

  describe('reducer', () => {
    it('should return initial state when undefined state is supplied', () => {
      const newState = userReducer(undefined, {} as Action);

      expect(newState).toEqual(initialState);
    });

    it('should return initial state when undefined action is supplied', () => {
      const newState = userReducer(initialState, {} as Action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('LoginUser actions', () => {
    it('should set customer and authorized when LoginUserSuccess action is reduced', () => {
      const newState = userReducer(initialState, loginUserSuccess({ customer, user }));

      expect(newState).toEqual({ ...initialState, customer, user, authorized: true });
    });

    it('should set user when LoginUserSuccess action is reduced for a private customer', () => {
      const newState = userReducer(initialState, loginUserSuccess({ customer, user }));

      expect(newState.customer.isBusinessCustomer).toEqual(customer.isBusinessCustomer);
      expect(newState.user.firstName).toEqual(user.firstName);
      expect(newState.authorized).toBeTrue();
    });

    it('should set error when LoginUserFail action is reduced', () => {
      const error = makeHttpError({ status: 500, code: 'error' });
      const newState = userReducer(initialState, loginUserFail({ error }));

      expect(newState).toEqual({ ...initialState, error });
    });

    it('should set error when LoginUserFail action is reduced and error is reset after reset action', () => {
      const error = makeHttpError({ status: 500, code: 'error' });
      let newState = userReducer(initialState, loginUserFail({ error }));

      expect(newState).toEqual({ ...initialState, error });

      newState = userReducer(newState, userErrorReset());
      expect(newState.error).toBeUndefined();
    });
  });

  describe('LoadCompanyUser actions', () => {
    it('should set user when LoadCompanyUserSuccess action is reduced', () => {
      const newState = userReducer(initialState, loadCompanyUserSuccess({ user }));

      expect(newState).toEqual({ ...initialState, user });
    });

    it('should set error when LoadCompanyUserFail action is reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = loadCompanyUserFail({ error });
      const state = userReducer(initialState, action);

      expect(state.error).toEqual(error);
    });
  });

  describe('Create user actions', () => {
    it('should set error when CreateUserFail action is reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = createUserFail({ error });
      const state = userReducer(initialState, action);

      expect(state.error).toEqual(error);
    });
  });

  describe('Update user actions', () => {
    it('should loading to true when UpdateUser action is reduced', () => {
      const action = updateUser({ user: {} as User });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should set user and set loading to false when UpdateUserSuccess is reduced', () => {
      const changedUser = {
        firstName: 'test',
      } as User;

      const action = updateUserSuccess({ user: changedUser as User, successMessage: { message: 'success' } });
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(changedUser);
      expect(state.loading).toBeFalse();
    });

    it('should set error and set loading to false when UpdateUserFail is reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = updateUserFail({ error });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toEqual(error);
    });
  });

  describe('Update user password actions', () => {
    it('should loading to true when UpdateUserPassword action is reduced', () => {
      const action = updateUserPassword({ password: '123', currentPassword: '1234' });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should set successMessage and reset loading when UpdateUserPasswordSuccess is reduced', () => {
      const action = updateUserPasswordSuccess({ successMessage: { message: 'success' } });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
    });

    it('should set error and set loading to false when UpdateUserPasswordFail is reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = updateUserPasswordFail({ error });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toEqual(error);
    });
  });

  describe('Update customer actions', () => {
    it('should loading to true when UpdateCustomer action is reduced', () => {
      const action = updateCustomer({ customer: {} as Customer });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should set customer and set loading to false when UpdateCustomerSuccess is reduced', () => {
      const changedCustomer = {
        companyName: 'test',
      } as Customer;

      const action = updateCustomerSuccess({ customer: changedCustomer, successMessage: { message: 'success' } });
      const state = userReducer(initialState, action);

      expect(state.customer).toEqual(changedCustomer);
      expect(state.loading).toBeFalse();
    });

    it('should set error and set loading to false when UpdateCustomerFail is reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = updateCustomerFail({ error });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toEqual(error);
    });
  });

  describe('LoadUserPaymentMethods action', () => {
    it('should set loading when reduced', () => {
      const action = loadUserPaymentMethods();
      const response = userReducer(initialState, action);

      expect(response.loading).toBeTrue();
    });
  });

  describe('LoadUserPaymentMethodsSuccess action', () => {
    it('should set success when reduced', () => {
      const action = loadUserPaymentMethodsSuccess({ paymentMethods: [{ id: 'ISH_CREDITCARD' } as PaymentMethod] });
      const response = userReducer(initialState, action);

      expect(response.paymentMethods).toHaveLength(1);
      expect(response.loading).toBeFalse();
    });
  });

  describe('LoadUserPaymentMethodsFail action', () => {
    it('should set error when reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = loadUserPaymentMethodsFail({ error });
      const response = userReducer(initialState, action);

      expect(response.error).toMatchObject(error);
      expect(response.loading).toBeFalse();
    });
  });

  describe('DeleteUserPayment action', () => {
    it('should set loading when reduced', () => {
      const action = deleteUserPaymentInstrument({ id: 'paymentInstrumentId' });
      const response = userReducer(initialState, action);

      expect(response.loading).toBeTrue();
    });
  });

  describe('DeleteUserPaymentSuccess action', () => {
    it('should set loading to false when reduced', () => {
      const action = deleteUserPaymentInstrumentSuccess();
      const response = userReducer(initialState, action);

      expect(response.loading).toBeFalse();
    });
  });

  describe('DeleteUserPaymentFail action', () => {
    it('should set error when reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = deleteUserPaymentInstrumentFail({ error });
      const response = userReducer(initialState, action);

      expect(response.error).toMatchObject(error);
      expect(response.loading).toBeFalse();
    });
  });

  describe('Password Reminder initialState', () => {
    it('should have nothing in it when unmodified', () => {
      expect(initialState.passwordReminderError).toBeUndefined();
      expect(initialState.passwordReminderSuccess).toBeFalsy();
      expect(initialState.loading).toBeFalsy();
    });
  });

  describe('RequestPasswordReminderSuccess action', () => {
    it('should set success when reduced', () => {
      const action = requestPasswordReminderSuccess();
      const response = userReducer(initialState, action);

      expect(response.passwordReminderError).toBeUndefined();
      expect(response.passwordReminderSuccess).toBeTrue();
      expect(response.loading).toBeFalse();
    });
  });

  describe('RequestPasswordReminderFail action', () => {
    it('should set error when reduced', () => {
      const error = makeHttpError({ message: 'invalid' });
      const action = requestPasswordReminderFail({ error });
      const response = userReducer(initialState, action);

      expect(response.passwordReminderError).toMatchObject(error);
      expect(response.passwordReminderSuccess).toBeFalse();
      expect(response.loading).toBeFalse();
    });
  });

  describe('RequestPasswordReminderReset action', () => {
    it('should set success & reset when reduced', () => {
      let state = userReducer(initialState, requestPasswordReminderSuccess());
      state = userReducer(state, resetPasswordReminder());

      expect(state.passwordReminderError).toBeUndefined();
      expect(state.passwordReminderSuccess).toBeFalsy();
      expect(state.loading).toBeFalsy();
    });
  });

  describe('RequestPasswordReminder action', () => {
    it('should set loading when reduced', () => {
      const data: PasswordReminder = {
        email: 'patricia@test.intershop.de',
      };
      const state = userReducer(initialState, requestPasswordReminder({ data }));

      expect(state.passwordReminderError).toBeUndefined();
      expect(state.passwordReminderSuccess).toBeFalsy();
      expect(state.loading).toBeTrue();
    });
  });
});
