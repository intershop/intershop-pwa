import { TestBed } from '@angular/core/testing';

import { DataRequest, DataRequestConfirmation } from 'ish-core/models/data-request/data-request.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  confirmGDPRDataRequest,
  confirmGDPRDataRequestFail,
  confirmGDPRDataRequestSuccess,
} from './data-requests.actions';
import { firstGDPRDataRequest, getDataRequestError, getDataRequestLoading } from './data-requests.selectors';

describe('Data Requests Selectors', () => {
  let store$: StoreWithSnapshots;

  const dataRequest = { requestID: '0123456789', hash: 'test_hash' } as DataRequest;
  const payloadSuccess = { infoCode: 'gdpr_request.confirmed.info' } as DataRequestConfirmation;
  const payloadAlreadyConfirmed = { infoCode: 'already.confirmed' } as DataRequestConfirmation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('dataRequests')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not set status when used', () => {
      expect(firstGDPRDataRequest(store$.state)).toBeTruthy();
      expect(getDataRequestLoading(store$.state)).toBeFalsy();
      expect(getDataRequestError(store$.state)).toBeUndefined();
    });
  });

  describe('loading confirmation', () => {
    beforeEach(() => {
      store$.dispatch(confirmGDPRDataRequest({ data: dataRequest }));
    });
    it('should set the state to loading', () => {
      expect(getDataRequestLoading(store$.state)).toBeTruthy();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(confirmGDPRDataRequestSuccess(payloadSuccess));
      });

      it('should set loading to false', () => {
        expect(getDataRequestLoading(store$.state)).toBeFalsy();
        expect(firstGDPRDataRequest(store$.state)).toBeTruthy();
      });
    });

    describe('and reporting already confirmed', () => {
      beforeEach(() => {
        store$.dispatch(confirmGDPRDataRequestSuccess(payloadAlreadyConfirmed));
      });

      it('should set loading to false', () => {
        expect(getDataRequestLoading(store$.state)).toBeFalsy();
        expect(firstGDPRDataRequest(store$.state)).toBeFalsy();
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(confirmGDPRDataRequestFail({ error: makeHttpError({ status: 422, message: 'error' }) }));
      });

      it('should set an error', () => {
        expect(getDataRequestLoading(store$.state)).toBeFalsy();
        expect(getDataRequestError(store$.state)).toBeTruthy();
      });
    });
  });
});
