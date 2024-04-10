import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { AddressDoctorStoreModule } from '../address-doctor-store.module';

import { addressDoctorInternalActions } from './address-doctor.actions';
import { getAddressDoctorConfig } from './address-doctor.selectors';

describe('Address Doctor Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddressDoctorStoreModule.forTesting('addressDoctorConfig'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be empty when in initial state', () => {
      expect(getAddressDoctorConfig(store$.state)).toBeUndefined();
    });
  });

  describe('after loading', () => {
    const action = addressDoctorInternalActions.setAddressDoctorConfig({
      config: {
        login: 'login',
        password: 'password',
        maxResultCount: 5,
        url: 'http://address-doctor.com',
      },
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set store value to true', () => {
      expect(getAddressDoctorConfig(store$.state)).toBeTruthy();
    });
  });
});
