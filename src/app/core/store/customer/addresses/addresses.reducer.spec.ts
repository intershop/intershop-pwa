import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import {
  CreateBasketAddress,
  CreateBasketAddressSuccess,
  DeleteBasketShippingAddress,
  UpdateBasketAddress,
} from 'ish-core/store/customer/basket/basket.actions';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  CreateCustomerAddress,
  CreateCustomerAddressFail,
  CreateCustomerAddressSuccess,
  DeleteCustomerAddress,
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  LoadAddresses,
  LoadAddressesFail,
  LoadAddressesSuccess,
  UpdateCustomerAddressFail,
  UpdateCustomerAddressSuccess,
} from './addresses.actions';
import { addressesReducer, initialState } from './addresses.reducer';

describe('Addresses Reducer', () => {
  describe('LoadAddresses actions', () => {
    describe('LoadAddresses action', () => {
      it('should set loading to true', () => {
        const action = new LoadAddresses();
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('LoadAddressesFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new LoadAddressesFail({ error });
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

        const action = new LoadAddressesSuccess({ addresses });
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
        const action = new CreateCustomerAddress({ address: BasketMockData.getAddress() });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateBasketAddress action', () => {
      it('should set loading to true', () => {
        const action = new CreateBasketAddress({ address: BasketMockData.getAddress(), scope: 'invoice' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('CreateCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new CreateCustomerAddressFail({ error });
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

        const action = new CreateCustomerAddressSuccess({ address });
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

        const action = new CreateBasketAddressSuccess({ address, scope: 'invoice' });
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
        const action = new UpdateBasketAddress({ address: BasketMockData.getAddress() });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('UpdateCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new UpdateCustomerAddressFail({ error });
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

        const preAction = new CreateBasketAddressSuccess({ address, scope: 'shipping' });
        let state = addressesReducer(initialState, preAction);

        address.firstName = 'John';
        const action = new UpdateCustomerAddressSuccess({ address });
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
        const action = new DeleteBasketShippingAddress({ addressId: 'addressId' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteCustomerAddress action', () => {
      it('should set loading to true', () => {
        const action = new DeleteCustomerAddress({ addressId: 'addressId' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new DeleteCustomerAddressFail({ error });
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

        const preAction = new CreateBasketAddressSuccess({ address, scope: 'shipping' });
        let state = addressesReducer(initialState, preAction);

        const action = new DeleteCustomerAddressSuccess({ addressId: address.id });
        state = addressesReducer(state, action);

        expect(state.ids).toHaveLength(0);
        expect(state.loading).toBeFalse();
      });
    });
  });
});
