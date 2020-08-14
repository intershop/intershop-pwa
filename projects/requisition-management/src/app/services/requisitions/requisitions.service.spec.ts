import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

import { RequisitionsService } from './requisitions.service';

describe('Requisitions Service', () => {
  let apiServiceMock: ApiService;
  let requisitionsService: RequisitionsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
            { selector: getLoggedInUser, value: { login: 'pmiller@test.intershop.de' } as User },
          ],
        }),
      ],
    });
    requisitionsService = TestBed.inject(RequisitionsService);

    when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: {} }));
    when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of({ data: {} }));
  });

  it('should be created', () => {
    expect(requisitionsService).toBeTruthy();
  });

  it('should call the getRequisitions of customer API when fetching requisitions', done => {
    requisitionsService.getRequisitions('buyer', 'pending').subscribe(() => {
      verify(apiServiceMock.get('customers/4711/users/pmiller@test.intershop.de/requisitions', anything())).once();
      done();
    });
  });

  it('should call getRequisition of customer API when fetching a requisition', done => {
    requisitionsService.getRequisition('4712').subscribe(() => {
      verify(apiServiceMock.get('customers/4711/users/pmiller@test.intershop.de/requisitions/4712', anything())).once();
      done();
    });
  });

  it('should call updateRequisitionStatus of customer API when patching a requisition status', done => {
    requisitionsService.updateRequisitionStatus('4712', 'approved').subscribe(() => {
      verify(
        apiServiceMock.patch('customers/4711/users/pmiller@test.intershop.de/requisitions/4712', anything(), anything())
      ).once();
      done();
    });
  });
});
