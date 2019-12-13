import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError, HttpHeader } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

import {
  CreateUserFail,
  LoadCompanyUserFail,
  LoadCompanyUserSuccess,
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
  ResetPasswordReminder,
  UpdateCustomer,
  UpdateCustomerFail,
  UpdateCustomerSuccess,
  UpdateUser,
  UpdateUserFail,
  UpdateUserPassword,
  UpdateUserPasswordFail,
  UpdateUserPasswordSuccess,
  UpdateUserSuccess,
  UserAction,
  UserErrorReset,
} from './user.actions';
import { initialState, userReducer } from './user.reducer';

describe('User Reducer', () => {
  const customer = {
    customerNo: 'dummy',
    type: 'PrivateCustomer',
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

    it('should not have a success message when unmodified', () => {
      expect(initialState.successMessage).toBeUndefined();
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
      const newState = userReducer(undefined, {} as UserAction);

      expect(newState).toEqual(initialState);
    });

    it('should return initial state when undefined action is supplied', () => {
      const newState = userReducer(initialState, {} as UserAction);

      expect(newState).toEqual(initialState);
    });
  });

  describe('LoginUser actions', () => {
    it('should set initial when LoginUser action is reduced', () => {
      const newState = userReducer(initialState, new LoginUser({ credentials: { login: 'dummy', password: 'dummy' } }));

      expect(newState).toEqual(initialState);
    });

    it('should set customer and authorized when LoginUserSuccess action is reduced', () => {
      const newState = userReducer(initialState, new LoginUserSuccess({ customer, user }));

      expect(newState).toEqual({ ...initialState, customer, user, authorized: true });
    });

    it('should set user when LoginUserSuccess action is reduced with type = PrivateCustomer', () => {
      const newState = userReducer(initialState, new LoginUserSuccess({ customer, user }));

      expect(newState.customer.type).toEqual(customer.type);
      expect(newState.user.firstName).toEqual(user.firstName);
      expect(newState.authorized).toBeTrue();
    });

    it('should set error when LoginUserFail action is reduced', () => {
      const error = { status: 500, headers: { 'error-key': 'error' } as HttpHeader } as HttpError;
      const newState = userReducer(initialState, new LoginUserFail({ error }));

      expect(newState).toEqual({ ...initialState, error });
    });

    it('should set error when LoginUserFail action is reduced and error is resetted after reset action', () => {
      const error = { status: 500, headers: { 'error-key': 'error' } as HttpHeader } as HttpError;
      let newState = userReducer(initialState, new LoginUserFail({ error }));

      expect(newState).toEqual({ ...initialState, error });

      newState = userReducer(newState, new UserErrorReset());
      expect(newState.error).toBeUndefined();
    });

    it('should unset authorized and customer when reducing LoginUser', () => {
      const oldState = { ...initialState, customer, user, authorized: true };

      const newState = userReducer(oldState, new LoginUser({ credentials: { login: 'dummy', password: 'dummy' } }));

      expect(newState).toEqual({ ...initialState, customer: undefined, user: undefined, authorized: false });
    });
  });

  describe('Logout actions', () => {
    it('should unset authorized and customer when reducing LogoutUser', () => {
      const oldState = { ...initialState, customer, authorized: true };

      const newState = userReducer(oldState, new LogoutUser());

      expect(newState).toEqual({ ...initialState, customer: undefined, user: undefined, authorized: false });
    });
  });

  describe('LoadCompanyUser actions', () => {
    it('should set user when LoadCompanyUserSuccess action is reduced', () => {
      const newState = userReducer(initialState, new LoadCompanyUserSuccess({ user }));

      expect(newState).toEqual({ ...initialState, user });
    });

    it('should set error when LoadCompanyUserFail action is reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new LoadCompanyUserFail({ error });
      const state = userReducer(initialState, action);

      expect(state.error).toEqual(error);
    });
  });

  describe('Create user actions', () => {
    it('should set error when CreateUserFail action is reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new CreateUserFail({ error });
      const state = userReducer(initialState, action);

      expect(state.error).toEqual(error);
    });
  });

  describe('Update user actions', () => {
    it('should loading to true when UpdateUser action is reduced', () => {
      const action = new UpdateUser({ user: {} as User });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should set user and set loading to false when UpdateUserSuccess is reduced', () => {
      const changedUser = {
        firstName: 'test',
      } as User;

      const action = new UpdateUserSuccess({ user: changedUser as User, successMessage: 'success' });
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(changedUser);
      expect(state.successMessage).toEqual('success');
      expect(state.loading).toBeFalse();
    });

    it('should set error and set loading to false when UpdateUserFail is reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new UpdateUserFail({ error });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toEqual(error);
    });
  });

  describe('Update user password actions', () => {
    it('should loading to true when UpdateUserPassword action is reduced', () => {
      const action = new UpdateUserPassword({ password: '123', currentPassword: '1234' });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should set successMessage and reset loading when UpdateUserPasswordSuccess is reduced', () => {
      const action = new UpdateUserPasswordSuccess({ successMessage: 'success' });
      const state = userReducer(initialState, action);

      expect(state.successMessage).toEqual('success');
      expect(state.loading).toBeFalse();
    });

    it('should set error and set loading to false when UpdateUserPasswordFail is reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new UpdateUserPasswordFail({ error });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toEqual(error);
    });
  });

  describe('Update customer actions', () => {
    it('should loading to true when UpdateCustomer action is reduced', () => {
      const action = new UpdateCustomer({ customer: {} as Customer });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeTrue();
    });

    it('should set customer and set loading to false when UpdateCustomerSuccess is reduced', () => {
      const changedCustomer = {
        companyName: 'test',
      } as Customer;

      const action = new UpdateCustomerSuccess({ customer: changedCustomer, successMessage: 'success' });
      const state = userReducer(initialState, action);

      expect(state.customer).toEqual(changedCustomer);
      expect(state.successMessage).toEqual('success');
      expect(state.loading).toBeFalse();
    });

    it('should set error and set loading to false when UpdateCustomerFail is reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new UpdateCustomerFail({ error });
      const state = userReducer(initialState, action);

      expect(state.loading).toBeFalse();
      expect(state.error).toEqual(error);
    });
  });
});

describe('User Reducer for loading payment methods', () => {
  describe('LoadUserPaymentMethods action', () => {
    it('should set loading when reduced', () => {
      const action = new LoadUserPaymentMethods();
      const response = userReducer(initialState, action);

      expect(response.loading).toBeTrue();
    });
  });

  describe('LoadUserPaymentMethodsSuccess action', () => {
    it('should set success when reduced', () => {
      const action = new LoadUserPaymentMethodsSuccess({ paymentMethods: [{ id: 'ISH_CREDITCARD' } as PaymentMethod] });
      const response = userReducer(initialState, action);

      expect(response.paymentMethods).toHaveLength(1);
      expect(response.loading).toBeFalse();
    });
  });

  describe('LoadUserPaymentMethodsFail action', () => {
    it('should set error when reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new LoadUserPaymentMethodsFail({ error });
      const response = userReducer(initialState, action);

      expect(response.error).toMatchObject(error);
      expect(response.loading).toBeFalse();
    });
  });
});

describe('User Reducer for Password Reminder', () => {
  describe('initialState', () => {
    it('should have nothing in it when unmodified', () => {
      expect(initialState.passwordReminderError).toBeUndefined();
      expect(initialState.passwordReminderSuccess).toBeFalsy();
      expect(initialState.loading).toBeFalsy();
    });
  });

  describe('RequestPasswordReminderSuccess action', () => {
    it('should set success when reduced', () => {
      const action = new RequestPasswordReminderSuccess();
      const response = userReducer(initialState, action);

      expect(response.passwordReminderError).toBeUndefined();
      expect(response.passwordReminderSuccess).toBeTrue();
      expect(response.loading).toBeFalse();
    });
  });

  describe('RequestPasswordReminderFail action', () => {
    it('should set error when reduced', () => {
      const error = { message: 'invalid' } as HttpError;
      const action = new RequestPasswordReminderFail({ error });
      const response = userReducer(initialState, action);

      expect(response.passwordReminderError).toMatchObject(error);
      expect(response.passwordReminderSuccess).toBeFalse();
      expect(response.loading).toBeFalse();
    });
  });

  describe('RequestPasswordReminderReset action', () => {
    it('should set success & reset when reduced', () => {
      let state = userReducer(initialState, new RequestPasswordReminderSuccess());
      state = userReducer(state, new ResetPasswordReminder());

      expect(state.passwordReminderError).toBeUndefined();
      expect(state.passwordReminderSuccess).toBeFalsy();
      expect(state.loading).toBeFalsy();
    });
  });

  describe('RequestPasswordReminder action', () => {
    it('should set loading when reduced', () => {
      const data: PasswordReminder = {
        email: 'patricia@test.intershop.de',
        firstName: 'Patricia',
        lastName: 'Miller',
      };
      const state = userReducer(initialState, new RequestPasswordReminder({ data }));

      expect(state.passwordReminderError).toBeUndefined();
      expect(state.passwordReminderSuccess).toBeFalsy();
      expect(state.loading).toBeTrue();
    });
  });
});
