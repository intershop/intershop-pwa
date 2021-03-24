import { TestBed } from '@angular/core/testing';

import { Address } from 'ish-core/models/address/address.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { cancelRegistration, registerFailure, registerSuccess } from './sso-registration.actions';
import {
  getSsoRegistrationCancelled,
  getSsoRegistrationError,
  getSsoRegistrationRegistered,
} from './sso-registration.selectors';

const customer = { customerNo: 'CID', isBusinessCustomer: true } as Customer;

describe('Sso Registration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('ssoRegistration')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not return anything when in initial state', () => {
      expect(getSsoRegistrationRegistered(store$.state)).toBeFalse();
      expect(getSsoRegistrationCancelled(store$.state)).toBeFalse();
      expect(getSsoRegistrationError(store$.state)).toBeUndefined();
    });
  });

  describe('registerSuccess', () => {
    const address = { id: 'asd', firstName: 'John' } as Address;
    const action = registerSuccess({
      customer,
      address,
      userId: 'uid',
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set registered after dispatching registerSuccess', () => {
      expect(getSsoRegistrationRegistered(store$.state)).toBeTrue();
    });
  });

  describe('registerFailure', () => {
    const action = registerFailure({ error: makeHttpError({}) });
    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set error after dispatching registerFailure', () => {
      expect(getSsoRegistrationError(store$.state)).toBeTruthy();
    });
  });

  describe('cancelRegistration', () => {
    const action = cancelRegistration();
    beforeEach(() => {
      store$.dispatch(action);
    });
    it('should set cancelled state after cancellation action', () => {
      expect(getSsoRegistrationCancelled(store$.state)).toBeTrue();
    });
  });
});
