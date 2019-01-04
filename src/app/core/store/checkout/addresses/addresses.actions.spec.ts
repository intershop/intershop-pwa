import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import * as fromActions from './addresses.actions';

describe('Addresses Actions', () => {
  describe('Load Addresses Actions', () => {
    it('should create new action for LoadAddresses', () => {
      const action = new fromActions.LoadAddresses();

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.LoadAddresses,
      });
    });

    it('should create new action for LoadAddressesFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadAddressesFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.LoadAddressesFail,
        payload,
      });
    });

    it('should create new action for LoadAddressesSuccess', () => {
      const payload = [{ urn: '123' } as Address];
      const action = new fromActions.LoadAddressesSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.LoadAddressesSuccess,
        payload,
      });
    });
  });

  describe('Create Customer Address Actions', () => {
    it('should create new action for CreateCustomerAddress', () => {
      const payload = { urn: '123' } as Address;
      const action = new fromActions.CreateCustomerAddress(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.CreateCustomerAddress,
        payload,
      });
    });

    it('should create new action for CreateCustomerAddressFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.CreateCustomerAddressFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.CreateCustomerAddressFail,
        payload,
      });
    });

    it('should create new action for CreateCustomerAddressSuccess', () => {
      const payload = { urn: '123' } as Address;
      const action = new fromActions.CreateCustomerAddressSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.CreateCustomerAddressSuccess,
        payload,
      });
    });
  });

  describe('Update Customer Address Actions', () => {
    it('should create new action for UpdateCustomerAddressFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.UpdateCustomerAddressFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.UpdateCustomerAddressFail,
        payload,
      });
    });

    it('should create new action for UpdateCustomerAddressSuccess', () => {
      const payload = BasketMockData.getAddress();
      const action = new fromActions.UpdateCustomerAddressSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.UpdateCustomerAddressSuccess,
        payload,
      });
    });
  });

  describe('Delete Customer Address Actions', () => {
    it('should create new action for DeleteCustomerAddressFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.DeleteCustomerAddressFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.DeleteCustomerAddressFail,
        payload,
      });
    });

    it('should create new action for DeleteCustomerAddressSuccess', () => {
      const payload = '123';
      const action = new fromActions.DeleteCustomerAddressSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.DeleteCustomerAddressSuccess,
        payload,
      });
    });
  });

  describe('Reset Addresses Action', () => {
    it('should create new action for Reset Addresses', () => {
      const action = new fromActions.ResetAddresses();

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.ResetAddresses,
      });
    });
  });
});
