import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketPaymentService } from './basket-payment.service';

describe('Basket Payment Service', () => {
  let basketPaymentService: BasketPaymentService;
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
    basketPaymentService = TestBed.get(BasketPaymentService);
  });

  it("should get basket eligible payment methods for a basket when 'getBasketEligiblePaymentMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketPaymentService.getBasketEligiblePaymentMethods(basketMockData.data.id).subscribe(() => {
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

    basketPaymentService.setBasketPayment(basketMockData.data.id, basketMockData.data.payment.name).subscribe(() => {
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
      parameters_: [
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

    basketPaymentService.createBasketPayment(basketMockData.data.id, paymentInstrument).subscribe(() => {
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

    basketPaymentService.updateBasketPayment(basketMockData.data.id, params).subscribe(() => {
      verify(apiService.patch(`baskets/${basketMockData.data.id}/payments/open-tender`, anything(), anything())).once();
      done();
    });
  });

  it("should delete a payment instrument from basket when 'deleteBasketInstrument' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketPaymentService.deleteBasketPaymentInstrument(basketMockData.data.id, 'paymentInstrumentId').subscribe(() => {
      verify(
        apiService.delete(`baskets/${basketMockData.data.id}/payment-instruments/paymentInstrumentId`, anything())
      ).once();
      done();
    });
  });
});
