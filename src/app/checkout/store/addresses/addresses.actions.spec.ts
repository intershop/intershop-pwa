import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';

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
    it('should create new action for CreateCustomerAddressFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.CreateCustomerAddressFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.CreateCustomerAddressFail,
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

  describe('Reset Addresses Action', () => {
    it('should create new action for Reset Addresses', () => {
      const action = new fromActions.ResetAddresses();

      expect({ ...action }).toEqual({
        type: fromActions.AddressActionTypes.ResetAddresses,
      });
    });
  });
});
