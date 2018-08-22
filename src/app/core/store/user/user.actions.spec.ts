import { Customer } from '../../../models/customer/customer.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { User } from '../../../models/user/user.model';

import * as fromActions from './user.actions';

describe('User Actions', () => {
  describe('Login User Actions', () => {
    it('should create new action for LoginUser', () => {
      const payload = {
        login: 'test',
        password: 'test',
      };
      const action = new fromActions.LoginUser(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LoginUser,
        payload,
      });
    });

    it('should create new action for LoginUserFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoginUserFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LoginUserFail,
        payload,
      });
    });

    it('should create new action for LoginUserSuccess', () => {
      const payload = { type: 'PrivateCustomer' } as Customer;
      const action = new fromActions.LoginUserSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LoginUserSuccess,
        payload,
      });
    });
  });

  describe('Load Company User Actions', () => {
    it('should create new action for LoadCompanyUser', () => {
      const action = new fromActions.LoadCompanyUser();

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LoadCompanyUser,
      });
    });

    it('should create new action for LoadCompanyUserFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadCompanyUserFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LoadCompanyUserFail,
        payload,
      });
    });

    it('should create new action for LoadCompanyUserSuccess', () => {
      const payload = { type: 'SMBCustomerUser' } as User;
      const action = new fromActions.LoadCompanyUserSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LoadCompanyUserSuccess,
        payload,
      });
    });
  });

  describe('Logout User Actions', () => {
    it('should create new action for LogoutUser', () => {
      const action = new fromActions.LogoutUser();

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.LogoutUser,
      });
    });
  });

  describe('Create User Actions', () => {
    it('should create new action for CreateUser', () => {
      const payload = {
        type: 'PrivateCustomer',
      } as Customer;
      const action = new fromActions.CreateUser(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.CreateUser,
        payload,
      });
    });

    it('should create new action for CreateUserFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.CreateUserFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.CreateUserFail,
        payload,
      });
    });

    it('should create new action for CreateUserSuccess', () => {
      const payload = {
        type: 'PrivateCustomer',
      } as Customer;
      const action = new fromActions.CreateUserSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.UserActionTypes.CreateUserSuccess,
        payload,
      });
    });

    describe('User Error Reset Actions', () => {
      it('should create new action for UserErrorReset', () => {
        const action = new fromActions.UserErrorReset();

        expect({ ...action }).toEqual({
          type: fromActions.UserActionTypes.UserErrorReset,
        });
      });
    });
  });
});
