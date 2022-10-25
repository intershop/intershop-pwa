import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { ProductNotificationsService } from './product-notifications.service';

describe('Product Notifications Service', () => {
  let apiServiceMock: ApiService;
  let productNotificationsService: ProductNotificationsService;
  let store$: MockStore;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({ selectors: [{ selector: getLoggedInCustomer, value: undefined }] }),
      ],
    });
    productNotificationsService = TestBed.inject(ProductNotificationsService);

    store$ = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(productNotificationsService).toBeTruthy();
  });
});
