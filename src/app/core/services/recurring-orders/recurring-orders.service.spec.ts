import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { RecurringOrdersService } from './recurring-orders.service';

describe('Recurring Orders Service', () => {
  let apiServiceMock: ApiService;
  let recurringOrdersService: RecurringOrdersService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: undefined }] }),
      ],
    });
    recurringOrdersService = TestBed.inject(RecurringOrdersService);
  });

  it('should be created', () => {
    expect(recurringOrdersService).toBeTruthy();
  });
});
