import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import {
  CreateBasketInvoiceAddress,
  CreateBasketInvoiceAddressSuccess,
  CreateBasketShippingAddress,
  CreateBasketShippingAddressSuccess,
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
