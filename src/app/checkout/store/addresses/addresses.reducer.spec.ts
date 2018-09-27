import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import {
  CreateBasketInvoiceAddress,
  CreateBasketInvoiceAddressSuccess,
  CreateBasketShippingAddress,
  CreateBasketShippingAddressSuccess,
  DeleteBasketShippingAddress,
  UpdateBasketCustomerAddress,
} from '../basket/basket.actions';

import * as fromActions from './addresses.actions';
import { addressesReducer, initialState } from './addresses.reducer';

describe('Addresses Reducer', () => {
  describe('LoadAddresses actions', () => {
    describe('LoadAddresses action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadAddresses();
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadAddressesFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.LoadAddressesFail(error);
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('LoadAddressesSuccess action', () => {
      it('should set addresses, set loading to false and reset error', () => {
        const addresses = [
          {
            id: 'test',
          } as Address,
        ];

        const action = new fromActions.LoadAddressesSuccess(addresses);
        const state = addressesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities.test).toEqual({ id: 'test' } as Address);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('CreateCustomerAddress actions', () => {
    describe('CreateBasketInvoiceAddress action', () => {
      it('should set loading to true', () => {
        const action = new CreateBasketInvoiceAddress(BasketMockData.getAddress());
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateBasketShippingAddress action', () => {
      it('should set loading to true', () => {
        const action = new CreateBasketShippingAddress(BasketMockData.getAddress());
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.CreateCustomerAddressFail(error);
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateBasketInvoiceAddressSuccess action', () => {
      it('should add invoice address to store, set loading to false and reset error', () => {
        const address = {
          id: 'test',
        } as Address;

        const action = new CreateBasketInvoiceAddressSuccess(address);
        const state = addressesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities.test).toEqual({ id: 'test' } as Address);
        expect(state.loading).toBeFalse();
      });

      it('should add shipping address to store, set loading to false and reset error', () => {
        const address = {
          id: 'test',
        } as Address;

        const action = new CreateBasketShippingAddressSuccess(address);
        const state = addressesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities.test).toEqual({ id: 'test' } as Address);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('UpdateCustomerAddress actions', () => {
    describe('UpdateBasketCustomerAddress action', () => {
      it('should set loading to true', () => {
        const action = new UpdateBasketCustomerAddress(BasketMockData.getAddress());
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.UpdateCustomerAddressFail(error);
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('UpdateCustomerAddressSuccess action', () => {
      it('should update address in store, set loading to false and reset error', () => {
        const address = {
          id: 'addressId',
          firstName: 'Patricia',
        } as Address;

        const preAction = new CreateBasketShippingAddressSuccess(address);
        let state = addressesReducer(initialState, preAction);

        address.firstName = 'John';
        const action = new fromActions.UpdateCustomerAddressSuccess(address);
        state = addressesReducer(state, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities.addressId.firstName).toEqual('John');
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('DeleteCustomerAddress actions', () => {
    describe('DeleteBasketShippingAddress action', () => {
      it('should set loading to true', () => {
        const action = new DeleteBasketShippingAddress('addressId');
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.DeleteCustomerAddressFail(error);
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('DeleteCustomerAddressSuccess action', () => {
      it('should delete address from store, set loading to false and reset error', () => {
        const address = {
          id: 'addressId',
        } as Address;

        const preAction = new CreateBasketShippingAddressSuccess(address);
        let state = addressesReducer(initialState, preAction);

        const action = new fromActions.DeleteCustomerAddressSuccess(address.id);
        state = addressesReducer(state, action);

        expect(state.ids).toHaveLength(0);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('ResetAddresses action', () => {
    it('should reset to initial state', () => {
      const oldState = {
        ...initialState,
        loading: true,
        addresses: [{ ids: ['test'] }],
      };
      const action = new fromActions.ResetAddresses();
      const state = addressesReducer(oldState, action);

      expect(state).toEqual(initialState);
    });
  });
});
