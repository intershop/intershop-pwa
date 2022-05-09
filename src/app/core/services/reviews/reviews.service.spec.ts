import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { ReviewsService } from './reviews.service';

describe('Reviews Service', () => {
  let apiServiceMock: ApiService;
  let reviewsService: ReviewsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: 'customer', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    reviewsService = TestBed.inject(ReviewsService);
  });

  it('should be created', () => {
    expect(reviewsService).toBeTruthy();
  });
});
