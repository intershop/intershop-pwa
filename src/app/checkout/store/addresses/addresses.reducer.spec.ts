import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import * as fromActions from './addresses.actions';
import { addressesReducer, initialState } from './addresses.reducer';

describe('Addresses Reducer', () => {
  describe('LoadAddresses actions', () => {
    describe('LoadCategory action', () => {
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
});
