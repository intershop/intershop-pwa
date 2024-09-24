import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { getBasketIdOrCurrent } from 'ish-core/store/customer/basket';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { PaymentService } from './payment.service';

describe('Payment Service', () => {
  let paymentService: PaymentService;
  let apiServiceMock: ApiService;
  let appFacadeMock: AppFacade;

  const paymentInstrument = {
    id: '4321',
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

  const newPaymentInstrument = {
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
  } as PaymentInstrument;

  const creditCardPaymentInstrument = {
    id: 'UZUKgzzAppcAAAFzK9FDCMcG',
    parameters: [
      {
        name: 'paymentInstrumentId',
        value: '****************************',
      },
      {
        name: 'cvcLastUpdated',
        value: '2020-04-30T13:41:45Z',
      },
      {
        name: 'token',
        value: 'payment_instrument_123',
      },
    ],
    paymentMethod: 'Concardis_CreditCard',
    urn: 'urn:payment-instrument:basket:_3oKgzzAfGgAAAFzuFpDCMcE:UZUKgzzAppcAAAFzK9FDCMcG',
  };

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.currentBasketEndpoint()).thenReturn(instance(apiServiceMock));
    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);

    appFacadeMock = mock(AppFacade);
    when(appFacadeMock.customerRestResource$).thenReturn(of('customers'));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: APP_BASE_HREF, useFactory: () => '/' },
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
        provideMockStore({
          selectors: [
            { selector: getCurrentLocale, value: 'en_US' },
            { selector: getBasketIdOrCurrent, value: 'current' },
          ],
        }),
      ],
    });

    paymentService = TestBed.inject(PaymentService);
  });

  describe('basket payment service', () => {
    it("should get basket eligible payment methods for a basket when 'getBasketEligiblePaymentMethods' is called", done => {
      when(apiServiceMock.get(anyString(), anything())).thenReturn(of({ data: [] }));

      paymentService.getBasketEligiblePaymentMethods().subscribe(() => {
        // basket-endpoint 'baskets/current' is not considered in the verify, only data that comes after it
        verify(apiServiceMock.get(`eligible-payment-methods`, anything())).once();
        done();
      });
    });

    it("should set a payment to the basket when 'setBasketFastCheckoutPayment' is called", done => {
      when(apiServiceMock.put(anyString(), anything(), anything())).thenReturn(
        of({
          data: {
            redirect: {
              redirectUrl: '/checkout/review',
            },
          },
        })
      );

      paymentService.setBasketFastCheckoutPayment('testPayment').subscribe(() => {
        verify(apiServiceMock.put(`payments/open-tender`, anything(), anything())).once();
        done();
      });
    });

    it("should set a payment to the basket when 'setBasketPayment' is called", done => {
      when(apiServiceMock.put(anyString(), anything(), anything())).thenReturn(of({}));

      paymentService.setBasketPayment('testPayment').subscribe(() => {
        verify(apiServiceMock.put(`payments/open-tender`, anything(), anything())).once();
        done();
      });
    });

    it("should create a payment instrument for the basket when 'createBasketPayment' is called", done => {
      when(apiServiceMock.post(anyString(), anything(), anything())).thenReturn(of([]));

      paymentService.createBasketPayment(newPaymentInstrument).subscribe(() => {
        verify(apiServiceMock.post(`payment-instruments`, anything(), anything())).once();
        done();
      });
    });

    it("should update a basket payment when 'updateBasketPayment' is called", done => {
      when(apiServiceMock.patch(anyString(), anything(), anything())).thenReturn(of({}));

      const params = {
        redirect: 'success',
        param1: '123',
        param2: '456',
      };

      paymentService.updateBasketPayment(params).subscribe(() => {
        verify(apiServiceMock.patch(`payments/open-tender`, anything(), anything())).once();
        done();
      });
    });

    it("should delete a (basket) payment instrument from basket when 'deleteBasketPaymentInstrument' is called", done => {
      when(apiServiceMock.delete(anyString(), anything())).thenReturn(of({}));

      paymentService.deleteBasketPaymentInstrument(BasketMockData.getBasket(), paymentInstrument).subscribe(() => {
        verify(
          apiServiceMock.delete(
            `baskets/${BasketMockData.getBasket().id}/payment-instruments/${paymentInstrument.id}`,
            anything()
          )
        ).once();
        done();
      });
    });

    it("should delete a (user) payment instrument from basket when 'deleteBasketPaymentInstrument' is called", done => {
      when(apiServiceMock.delete(anyString())).thenReturn(of({}));
      when(apiServiceMock.delete(anyString(), anything())).thenReturn(of({}));

      const userPaymentInstrument: PaymentInstrument = {
        ...paymentInstrument,
        urn: 'urn:payment-instrument:user:fIQKAE8B4tYAAAFu7tuO4P6T:ug8KAE8B1dcAAAFvNQqSJBQg',
        id: BasketMockData.getPayment().paymentInstrument.id,
      };

      paymentService.deleteBasketPaymentInstrument(BasketMockData.getBasket(), userPaymentInstrument).subscribe(() => {
        verify(apiServiceMock.delete(`customers/-/payments/${userPaymentInstrument.id}`)).once();
        verify(
          apiServiceMock.delete(`baskets/${BasketMockData.getBasket().id}/payments/open-tender`, anything())
        ).once();
        done();
      });
    });

    it("should delete a payment from basket when 'deleteBasketPayment' is called", done => {
      when(apiServiceMock.delete(anyString(), anything())).thenReturn(of({}));

      paymentService.deleteBasketPayment(BasketMockData.getBasket()).subscribe(() => {
        verify(
          apiServiceMock.delete(`baskets/${BasketMockData.getBasket().id}/payments/open-tender`, anything())
        ).once();
        done();
      });
    });

    it("should update payment instrument from basket when 'updateBasketPaymentInstrument' is called", done => {
      when(apiServiceMock.patch(anyString(), anything(), anything())).thenReturn(of({}));
      paymentService.updateConcardisCvcLastUpdated(creditCardPaymentInstrument).subscribe(() => {
        verify(
          apiServiceMock.patch(`payment-instruments/${creditCardPaymentInstrument.id}`, anything(), anything())
        ).once();
        done();
      });
    });
  });

  describe('user payment service', () => {
    it("should get a user's payment method data when 'getUserPaymentMethods' is called for b2c/b2x applications", done => {
      when(apiServiceMock.get(anyString())).thenReturn(of([]));
      when(apiServiceMock.resolveLinks()).thenReturn(() => of([]));
      const customer = {
        customerNo: '4711',
        isBusinessCustomer: false,
      } as Customer;

      paymentService.getUserPaymentMethods(customer).subscribe(() => {
        verify(apiServiceMock.get('customers/4711/payments')).once();
        verify(apiServiceMock.get('customers/4711/eligible-payment-methods')).once();
        done();
      });
    });

    it("should get a user's payment method data when 'getUserPaymentMethods' is called for rest applications", done => {
      when(apiServiceMock.get(anyString())).thenReturn(of([]));
      when(apiServiceMock.resolveLinks()).thenReturn(() => of([]));
      when(appFacadeMock.customerRestResource$).thenReturn(of('privatecustomers'));
      const customer = {
        customerNo: '4711',
        isBusinessCustomer: false,
      } as Customer;

      paymentService.getUserPaymentMethods(customer).subscribe(() => {
        verify(apiServiceMock.get('privatecustomers/4711/payments')).once();
        verify(apiServiceMock.get('privatecustomers/4711/eligible-payment-methods')).once();
        done();
      });
    });

    it("should create a payment instrument for the user when 'createUserPayment' is called", done => {
      const customerNo = '12345';

      when(apiServiceMock.post(`customers/${customerNo}/payments`, anything())).thenReturn(
        of({ type: 'Link', uri: 'site/-/customers/-/payments/paymentid' })
      );
      when(apiServiceMock.resolveLink()).thenReturn(() => of(undefined));

      paymentService.createUserPayment(customerNo, newPaymentInstrument).subscribe(() => {
        verify(apiServiceMock.post(`customers/${customerNo}/payments`, anything())).once();
        done();
      });
    });

    it("should delete a payment instrument from user when 'deleteUserPaymentInstrument' is called", done => {
      when(apiServiceMock.delete(anyString())).thenReturn(of({}));

      paymentService.deleteUserPaymentInstrument('-', paymentInstrument.id).subscribe(() => {
        verify(apiServiceMock.delete(`customers/-/payments/${paymentInstrument.id}`)).once();
        done();
      });
    });

    it("should update payment instrument from customer when 'updateBasketPaymentInstrument' is called", done => {
      when(apiServiceMock.put(anyString(), anything())).thenReturn(of({}));

      const userCreditCardPaymentInstrument: PaymentInstrument = {
        ...creditCardPaymentInstrument,
        urn: 'urn:payment-instrument:user:fIQKAE8B4tYAAAFu7tuO4P6T:ug8KAE8B1dcAAAFvNQqSJBQg',
      };

      paymentService.updateConcardisCvcLastUpdated(userCreditCardPaymentInstrument).subscribe(() => {
        verify(apiServiceMock.put(`customers/-/payments/${userCreditCardPaymentInstrument.id}`, anything())).once();
        done();
      });
    });
  });
});
