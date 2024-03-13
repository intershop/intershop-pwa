import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getICMBaseURL } from 'ish-core/store/core/configuration';

import { OrganizationHierarchiesService } from './organization-hierarchies.service';

describe('Organization Hierarchies Service', () => {
  let apiServiceMock: ApiService;
  let organizationHierarchiesService: OrganizationHierarchiesService;

  const allOrderIncludes = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems_discounts',
    'lineItems',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
  ];
  const icmBaseURL = 'bla';
  const buyingContext = 'testGroup';

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [{ selector: getICMBaseURL, value: icmBaseURL }],
        }),
      ],
    });
    organizationHierarchiesService = TestBed.inject(OrganizationHierarchiesService);
  });

  describe('getOrders', () => {
    it("should get orders when 'getOrders' is called", done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: [] }));
      const url = `orders?page[limit]=30`.concat(
        '&include=',
        allOrderIncludes.join(),
        OrganizationHierarchiesService.buyingContextInclude,
        buyingContext
      );
      organizationHierarchiesService.getOrders(30, buyingContext).subscribe(() => {
        verify(apiServiceMock.get(url, anything())).once();
        done();
      });
    });

    it("should get orders when 'getOrders' is called with amount", done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(of([]));
      const url = `orders?page[limit]=10`.concat('&include=', allOrderIncludes.join());
      organizationHierarchiesService.getOrders(10).subscribe(() => {
        verify(apiServiceMock.get(url, anything())).once();
        done();
      });
    });
  });

  describe('getGroups', () => {
    const customer = { customerNo: 'testNumber' } as Customer;

    it("should get groups when 'getGroups' is called", done => {
      when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: [] }));
      const url = icmBaseURL.concat('/organizations/', customer.customerNo, '/groups');
      organizationHierarchiesService.getGroups(customer).subscribe(() => {
        verify(apiServiceMock.get(url, anything())).once();
        done();
      });
    });
  });
});
