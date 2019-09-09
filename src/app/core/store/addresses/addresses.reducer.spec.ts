import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import {
  CreateBasketAddress,
  CreateBasketAddressSuccess,
  DeleteBasketShippingAddress,
  UpdateBasketAddress,
} from 'ish-core/store/checkout/basket/basket.actions';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

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
        const action = new fromActions.LoadAddressesFail({ error });
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

        const action = new fromActions.LoadAddressesSuccess({ addresses });
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
        const action = new fromActions.CreateCustomerAddress({ address: BasketMockData.getAddress() });
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
        const action = new fromActions.CreateCustomerAddressFail({ error });
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

        const action = new fromActions.CreateCustomerAddressSuccess({ address });
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
        const action = new fromActions.UpdateCustomerAddressFail({ error });
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
        const action = new fromActions.UpdateCustomerAddressSuccess({ address });
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
        const action = new fromActions.DeleteCustomerAddress({ addressId: 'addressId' });
        const state = addressesReducer(initialState, action);

        expect(state.loading).toBeTrue();
      });
    });

    describe('DeleteCustomerAddressFail action', () => {
      it('should set loading to false', () => {
        const error = { message: 'invalid' } as HttpError;
        const action = new fromActions.DeleteCustomerAddressFail({ error });
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

        const action = new fromActions.DeleteCustomerAddressSuccess({ addressId: address.id });
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
