import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { PaymentService } from './payment.service';

describe('Payment Service', () => {
  let paymentService: PaymentService;
  let apiService: ApiService;

  const basketMockData = {
    data: {
      id: 'test',
      calculationState: 'UNCALCULATED',
      buckets: [
        {
          lineItems: [],
          shippingMethod: {},
          shipToAddress: {},
        },
      ],
      payment: {
        name: 'testPayment',
        id: 'paymentId',
      },
      totals: {},
    },
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
            locale: localeReducer,
          },
        }),
      ],
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    paymentService = TestBed.get(PaymentService);
  });

  it("should get basket eligible payment methods for a basket when 'getBasketEligiblePaymentMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    paymentService.getBasketEligiblePaymentMethods(basketMockData.data.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.data.id}/eligible-payment-methods`, anything())).once();
      done();
    });
  });

  it("should set a payment to the basket when 'setBasketPayment' is called", done => {
    when(
      apiService.put(
        `baskets/${basketMockData.data.id}/payments/open-tender?include=paymentMethod`,
        anything(),
        anything()
      )
    ).thenReturn(of([]));

    paymentService.setBasketPayment(basketMockData.data.id, basketMockData.data.payment.name).subscribe(() => {
      verify(
        apiService.put(
          `baskets/${basketMockData.data.id}/payments/open-tender?include=paymentMethod`,
          anything(),
          anything()
        )
      ).once();
      done();
    });
  });

  it("should create a payment instrument for the basket when 'createBasketPayment' is called", done => {
    when(
      apiService.post(
        `baskets/${basketMockData.data.id}/payment-instruments?include=paymentMethod`,
        anything(),
        anything()
      )
    ).thenReturn(of([]));

    const paymentInstrument = {
      id: undefined,
      paymentMethod: 'ISH_DirectDebit',
      parameters: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    };

    paymentService.createBasketPayment(basketMockData.data.id, paymentInstrument).subscribe(() => {
      verify(
        apiService.post(
          `baskets/${basketMockData.data.id}/payment-instruments?include=paymentMethod`,
          anything(),
          anything()
        )
      ).once();
      done();
    });
  });

  it("should update a basket payment when 'updateBasketPayment' is called", done => {
    when(apiService.patch(`baskets/${basketMockData.data.id}/payments/open-tender`, anything(), anything())).thenReturn(
      of({})
    );

    const params = {
      redirect: 'success',
      param1: '123',
      param2: '456',
    };

    paymentService.updateBasketPayment(basketMockData.data.id, params).subscribe(() => {
      verify(apiService.patch(`baskets/${basketMockData.data.id}/payments/open-tender`, anything(), anything())).once();
      done();
    });
  });

  it("should delete a payment instrument from basket when 'deleteBasketInstrument' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    paymentService.deleteBasketPaymentInstrument(basketMockData.data.id, 'paymentInstrumentId').subscribe(() => {
      verify(
        apiService.delete(`baskets/${basketMockData.data.id}/payment-instruments/paymentInstrumentId`, anything())
      ).once();
      done();
    });
  });

  it("should get a user's payment method data when 'getUserPaymentMethods' is called", done => {
    when(apiService.get(anyString())).thenReturn(of([]));
    when(apiService.options(anyString())).thenReturn(of([]));
    const customer = {
      customerNo: '4711',
      type: 'PrivateCustomer',
    } as Customer;

    paymentService.getUserPaymentMethods(customer).subscribe(() => {
      verify(apiService.get('customers/4711/payments')).once();
      verify(apiService.options('customers/4711/payments')).once();
      done();
    });
  });

  it("should create a payment instrument for the user when 'createUserPayment' is called", done => {
    const customerNo = '12345';

    when(apiService.post(`customers/${customerNo}/payments`, anything())).thenReturn(
      of({ type: 'Link', uri: 'site/-/customers/-/payments/paymentid' })
    );
    when(apiService.get(anything())).thenReturn(of(undefined));

    const paymentInstrument = {
      id: undefined,
      paymentMethod: 'ISH_DirectDebit',
      parameters: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    };

    paymentService.createUserPayment(customerNo, paymentInstrument).subscribe(() => {
      verify(apiService.post(`customers/${customerNo}/payments`, anything())).once();
      done();
    });
  });
});
