import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { RequisitionsService } from './requisitions.service';

describe('Requisitions Service', () => {
  let apiServiceMock: ApiService;
  let requisitionsService: RequisitionsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.b2bUserEndpoint()).thenReturn(instance(apiServiceMock));
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    requisitionsService = TestBed.inject(RequisitionsService);

    when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: {} }));
    when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of({ data: {} }));
  });

  it('should be created', () => {
    expect(requisitionsService).toBeTruthy();
  });

  it('should call the getRequisitions of customer API when fetching requisitions', done => {
    requisitionsService.getRequisitions('buyer', 'PENDING').subscribe(() => {
      verify(apiServiceMock.get('requisitions', anything())).once();
      done();
    });
  });

  it('should call getRequisition of customer API when fetching a requisition', done => {
    requisitionsService.getRequisition('4712').subscribe(() => {
      verify(apiServiceMock.get('requisitions/4712', anything())).once();
      done();
    });
  });

  it('should call updateRequisitionStatus of customer API when patching a requisition status', done => {
    requisitionsService.updateRequisitionStatus('4712', 'APPROVED').subscribe(() => {
      verify(apiServiceMock.patch('requisitions/4712', anything(), anything())).once();
      done();
    });
  });
});
