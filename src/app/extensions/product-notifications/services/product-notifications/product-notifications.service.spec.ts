import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { ProductNotificationsService } from './product-notifications.service';

describe('Product Notifications Service', () => {
  let apiServiceMock: ApiService;
  let productNotificationsService: ProductNotificationsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    productNotificationsService = TestBed.inject(ProductNotificationsService);
  });

  it('should be created', () => {
    expect(productNotificationsService).toBeTruthy();
  });
  describe('getProductNotifications', () => {
    beforeEach(() => {
      when(apiServiceMock.get(anything())).thenReturn(of({ sku: '1234' }));
      when(apiServiceMock.resolveLinks()).thenReturn(() => of([]));
    });

    it("should get product stock notifications when 'getProductNotifications' for type stock is called for b2b rest applications", done => {
      productNotificationsService.getProductNotifications('stock').subscribe(data => {
        verify(apiServiceMock.get(`customers/4711/users/-/notifications/stock`)).once();
        expect(data).toMatchInlineSnapshot(`Array []`);
        done();
      });
    });

    it("should get product price notifications when 'getProductNotifications' for type price is called for b2b rest applications", done => {
      productNotificationsService.getProductNotifications('price').subscribe(data => {
        verify(apiServiceMock.get(`customers/4711/users/-/notifications/price`)).once();
        expect(data).toMatchInlineSnapshot(`Array []`);
        done();
      });
    });
  });
});
