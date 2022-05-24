import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { DataRequestData, DataRequestInfo } from 'ish-core/models/data-request/data-request.interface';
import { DataRequest } from 'ish-core/models/data-request/data-request.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { DataRequestsService } from './data-requests.service';

describe('Data Requests Service', () => {
  let apiServiceMock: ApiService;
  let dataRequestsService: DataRequestsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    dataRequestsService = TestBed.inject(DataRequestsService);
  });

  it('should be created', () => {
    expect(dataRequestsService).toBeTruthy();
  });

  describe('Confirm a data request', () => {
    it('should return an error when called with undefined', done => {
      when(apiServiceMock.put(anything(), anything())).thenReturn(of({}));

      dataRequestsService.confirmGDPRDataRequest(undefined).subscribe({
        next: fail,
        error: err => {
          expect(err).toMatchInlineSnapshot(`[Error: confirmGDPRDataRequest() called without data body]`);
          done();
        },
      });

      verify(apiServiceMock.put(anything(), anything())).never();
    });

    it("should confirm data request when 'confirmDataRequest' is called", done => {
      const requestData = {
        requestID: 'test_ID',
        hash: 'test_hash',
      } as DataRequest;
      const payloadData = {
        infos: [{ causes: [{ code: 'already confirmed' }] } as DataRequestInfo],
      } as DataRequestData;

      when(apiServiceMock.put(anything(), anything(), anything())).thenReturn(of(payloadData));

      dataRequestsService.confirmGDPRDataRequest(requestData).subscribe(payload => {
        verify(apiServiceMock.put('gdpr-requests/test_ID/confirmations', anything(), anything())).once();
        expect(capture(apiServiceMock.put).last()[0]).toMatchInlineSnapshot(`"gdpr-requests/test_ID/confirmations"`);
        expect(payload).toHaveProperty('infoCode', 'already confirmed');
        done();
      });
    });
  });
});
