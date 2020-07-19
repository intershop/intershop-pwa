import { Address } from 'ish-core/models/address/address.model';
import {
  createBasketAddress,
  createBasketAddressSuccess,
  deleteBasketShippingAddress,
  updateBasketAddress,
} from 'ish-core/store/customer/basket/basket.actions';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  createCustomerAddress,
  createCustomerAddressFail,
  createCustomerAddressSuccess,
  deleteCustomerAddress,
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  loadAddresses,
  loadAddressesFail,
  loadAddressesSuccess,
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from './addresses.actions';
import { addressesReducer, initialState } from './addresses.reducer';

describe('Addresses Reducer', () => {
  describe('LoadAddresses actions', () => {
    describe('LoadAddresses action', () => {
      it('should set loading to true', () => {
        const action = loadAddresses();
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadAddressesFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadAddressesFail({ error });
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

        const action = loadAddressesSuccess({ addresses });
        const state = addressesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities.test).toEqual({ id: 'test' } as Address);
        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('CreateCustomerAddress actions', () => {
    describe('CreateCustomerAddress action', () => {
      it('should set loading to true', () => {
        const action = createCustomerAddress({ address: BasketMockData.getAddress() });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateBasketAddress action', () => {
      it('should set loading to true', () => {
        const action = createBasketAddress({ address: BasketMockData.getAddress(), scope: 'invoice' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = createCustomerAddressFail({ error });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.error).toEqual(error);
      });
    });

    describe('CreateCustomerAddressSuccess action', () => {
      it('should add customer address to store, set loading to false and reset error', () => {
        const address = {
          id: 'test',
        } as Address;

        const action = createCustomerAddressSuccess({ address });
        const state = addressesReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities.test).toHaveProperty('id', 'test');
        expect(state.loading).toBeFalse();
      });
    });

    describe('CreateBasketAddressSuccess action', () => {
      it('should add invoice address to store, set loading to false and reset error', () => {
        const address = {
          id: 'test',
        } as Address;

        const action = createBasketAddressSuccess({ address, scope: 'invoice' });
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
        const action = updateBasketAddress({ address: BasketMockData.getAddress() });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = updateCustomerAddressFail({ error });
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

        const preAction = createBasketAddressSuccess({ address, scope: 'shipping' });
        let state = addressesReducer(initialState, preAction);

        address.firstName = 'John';
        const action = updateCustomerAddressSuccess({ address });
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
        const action = deleteBasketShippingAddress({ addressId: 'addressId' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteCustomerAddress action', () => {
      it('should set loading to true', () => {
        const action = deleteCustomerAddress({ addressId: 'addressId' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = deleteCustomerAddressFail({ error });
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

        const preAction = createBasketAddressSuccess({ address, scope: 'shipping' });
        let state = addressesReducer(initialState, preAction);

        const action = deleteCustomerAddressSuccess({ addressId: address.id });
        state = addressesReducer(state, action);

        expect(state.ids).toHaveLength(0);
        expect(state.loading).toBeFalse();
      });
    });
  });
});
