import { TestBed } from '@angular/core/testing';

import { Address } from 'ish-core/models/address/address.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { createBasketAddress, createBasketAddressSuccess, updateBasketAddress } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

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
import { getAddressesError, getAddressesLoading, getAllAddresses } from './addresses.selectors';

describe('Addresses Selectors', () => {
  let store$: StoreWithSnapshots;

  const addresses = [
    { id: '4711', firstName: 'Patricia' },
    { id: '4712', firstName: 'John' },
  ] as Address[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('addresses')],
      providers: [provideStoreSnapshots()],
    });
    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any addresses when used', () => {
      expect(getAllAddresses(store$.state)).toBeEmpty();
      expect(getAddressesLoading(store$.state)).toBeFalse();
      expect(getAddressesError(store$.state)).toBeUndefined();
    });
  });

  describe('loading addresses', () => {
    beforeEach(() => {
      store$.dispatch(loadAddresses());
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(loadAddressesSuccess({ addresses }));
      });

      it('should set loading to false and add all addresses', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual(addresses);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(loadAddressesFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded addresses on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toBeEmpty();
        expect(getAddressesError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "error",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('create customer addresses', () => {
    const address = BasketMockData.getAddress();

    beforeEach(() => {
      store$.dispatch(createCustomerAddress({ address }));
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressSuccess({ address }));
      });

      it('should set loading to false and add address', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual([address]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded addresses on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toBeEmpty();
        expect(getAddressesError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "error",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('create basket addresses', () => {
    const address = BasketMockData.getAddress();

    beforeEach(() => {
      store$.dispatch(createBasketAddress({ address, scope: 'invoice' }));
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(createBasketAddressSuccess({ address, scope: 'invoice' }));
      });

      it('should set loading to false and add basket address', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual([address]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have loaded addresses on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toBeEmpty();
        expect(getAddressesError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "error",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('update basket addresses', () => {
    const address = BasketMockData.getAddress();

    beforeEach(() => {
      store$.dispatch(updateBasketAddress({ address }));
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressSuccess({ address }));
        store$.dispatch(
          updateCustomerAddressSuccess({
            address: {
              ...address,
              firstName: 'updated firstName',
            },
          })
        );
      });

      it('should set loading to false and update address', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual([
          {
            ...address,
            firstName: 'updated firstName',
          },
        ]);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressSuccess({ address }));
        store$.dispatch(updateCustomerAddressFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have updated adress on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual([address]);
        expect(getAddressesError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "error",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('delete customer addresses', () => {
    const address = BasketMockData.getAddress();

    beforeEach(() => {
      store$.dispatch(deleteCustomerAddress({ addressId: address.id }));
    });

    it('should set the state to loading', () => {
      expect(getAddressesLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressSuccess({ address }));
        store$.dispatch(deleteCustomerAddressSuccess({ addressId: address.id }));
      });

      it('should set loading to false and delete address', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toBeEmpty();
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(createCustomerAddressSuccess({ address }));
        store$.dispatch(deleteCustomerAddressFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should not have delete addresses on error', () => {
        expect(getAddressesLoading(store$.state)).toBeFalse();
        expect(getAllAddresses(store$.state)).toEqual([address]);
        expect(getAddressesError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "error",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });
});
