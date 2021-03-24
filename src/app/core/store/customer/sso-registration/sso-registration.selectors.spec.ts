import { TestBed } from '@angular/core/testing';

import { Address } from 'ish-core/models/address/address.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { setRegistrationInfo } from './sso-registration.actions';
import { getSsoRegistrationInfo } from './sso-registration.selectors';

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
      expect(getSsoRegistrationInfo(store$.state)).toEqual({ address: undefined, companyInfo: undefined });
    });
  });

  describe('setRegistrationInfo', () => {
    const address = { id: 'asd', firstName: 'John' } as Address;
    const companyInfo = { companyName1: 'cn1', companyName2: 'cn2', taxationID: 'tid' };
    const action = setRegistrationInfo({ companyInfo, address });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should get info after dispatch', () => {
      expect(getSsoRegistrationInfo(store$.state)).toBeTruthy();
    });
  });
});
