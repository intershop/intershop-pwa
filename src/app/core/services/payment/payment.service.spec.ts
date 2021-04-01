import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { getBasketIdOrCurrent } from 'ish-core/store/customer/basket';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { PaymentService } from './payment.service';

describe('Payment Service', () => {
  let paymentService: PaymentService;
  let apiService: ApiService;
  let appFacade: AppFacade;

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
    apiService = mock(ApiService);
    appFacade = mock(AppFacade);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        provideMockStore({
          selectors: [
            { selector: getCurrentLocale, value: { lang: 'en_US' } as Locale },
            { selector: getBasketIdOrCurrent, value: 'current' },
          ],
        }),
      ],
    });
    when(appFacade.customerRestResource$).thenReturn(of('customers'));

    paymentService = TestBed.inject(PaymentService);
  });

  describe('basket payment service', () => {
    it("should get basket eligible payment methods for a basket when 'getBasketEligiblePaymentMethods' is called", done => {
      when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

      paymentService.getBasketEligiblePaymentMethods().subscribe(() => {
        verify(apiService.get(`baskets/current/eligible-payment-methods`, anything())).once();
        done();
      });
    });

    it("should set a payment to the basket when 'setBasketPayment' is called", done => {
      when(
        apiService.put(`baskets/current/payments/open-tender?include=paymentMethod`, anything(), anything())
      ).thenReturn(of([]));

      paymentService.setBasketPayment('testPayment').subscribe(() => {
        verify(
          apiService.put(`baskets/current/payments/open-tender?include=paymentMethod`, anything(), anything())
        ).once();
        done();
      });
    });

    it("should create a payment instrument for the basket when 'createBasketPayment' is called", done => {
      when(
        apiService.post(`baskets/current/payment-instruments?include=paymentMethod`, anything(), anything())
      ).thenReturn(of([]));

      paymentService.createBasketPayment(newPaymentInstrument).subscribe(() => {
        verify(
          apiService.post(`baskets/current/payment-instruments?include=paymentMethod`, anything(), anything())
        ).once();
        done();
      });
    });

    it("should update a basket payment when 'updateBasketPayment' is called", done => {
      when(apiService.patch(`baskets/current/payments/open-tender`, anything(), anything())).thenReturn(of({}));

      const params = {
        redirect: 'success',
        param1: '123',
        param2: '456',
      };

      paymentService.updateBasketPayment(params).subscribe(() => {
        verify(apiService.patch(`baskets/current/payments/open-tender`, anything(), anything())).once();
        done();
      });
    });

    it("should delete a (basket) payment instrument from basket when 'deleteBasketPaymentInstrument' is called", done => {
      when(apiService.delete(anyString(), anything())).thenReturn(of({}));

      paymentService.deleteBasketPaymentInstrument(BasketMockData.getBasket(), paymentInstrument).subscribe(() => {
        verify(
          apiService.delete(
            `baskets/${BasketMockData.getBasket().id}/payment-instruments/${paymentInstrument.id}`,
            anything()
          )
        ).once();
        done();
      });
    });

    it("should delete a (user) payment instrument from basket when 'deleteBasketPaymentInstrument' is called", done => {
      when(apiService.delete(anyString())).thenReturn(of({}));
      when(apiService.delete(anyString(), anything())).thenReturn(of({}));

      const userPaymentInstrument: PaymentInstrument = {
        ...paymentInstrument,
        urn: 'urn:payment-instrument:user:fIQKAE8B4tYAAAFu7tuO4P6T:ug8KAE8B1dcAAAFvNQqSJBQg',
        id: BasketMockData.getPayment().paymentInstrument.id,
      };

      paymentService.deleteBasketPaymentInstrument(BasketMockData.getBasket(), userPaymentInstrument).subscribe(() => {
        verify(apiService.delete(`customers/-/payments/${userPaymentInstrument.id}`)).once();
        verify(apiService.delete(`baskets/${BasketMockData.getBasket().id}/payments/open-tender`, anything())).once();
        done();
      });
    });

    it("should delete a payment from basket when 'deleteBasketPayment' is called", done => {
      when(apiService.delete(anyString(), anything())).thenReturn(of({}));

      paymentService.deleteBasketPayment(BasketMockData.getBasket()).subscribe(() => {
        verify(apiService.delete(`baskets/${BasketMockData.getBasket().id}/payments/open-tender`, anything())).once();
        done();
      });
    });

    it("should update payment instrument from basket when 'updateBasketPaymentInstrument' is called", done => {
      when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({}));
      paymentService.updateConcardisCvcLastUpdated(creditCardPaymentInstrument).subscribe(() => {
        verify(
          apiService.patch(
            `baskets/current/payment-instruments/${creditCardPaymentInstrument.id}`,
            anything(),
            anything()
          )
        ).once();
        done();
      });
    });
  });

  describe('user payment service', () => {
    it("should get a user's payment method data when 'getUserPaymentMethods' is called for b2c/b2x applications", done => {
      when(apiService.get(anyString())).thenReturn(of([]));
      when(apiService.resolveLinks()).thenReturn(() => of([]));
      when(apiService.options(anyString())).thenReturn(of([]));
      const customer = {
        customerNo: '4711',
        isBusinessCustomer: false,
      } as Customer;

      paymentService.getUserPaymentMethods(customer).subscribe(() => {
        verify(apiService.get('customers/4711/payments')).once();
        verify(apiService.options('customers/4711/payments')).once();
        done();
      });
    });

    it("should get a user's payment method data when 'getUserPaymentMethods' is called for rest applications", done => {
      when(apiService.get(anyString())).thenReturn(of([]));
      when(apiService.resolveLinks()).thenReturn(() => of([]));
      when(apiService.options(anyString())).thenReturn(of([]));
      when(appFacade.customerRestResource$).thenReturn(of('privatecustomers'));
      const customer = {
        customerNo: '4711',
        isBusinessCustomer: false,
      } as Customer;

      paymentService.getUserPaymentMethods(customer).subscribe(() => {
        verify(apiService.get('privatecustomers/4711/payments')).once();
        verify(apiService.options('privatecustomers/4711/payments')).once();
        done();
      });
    });

    it("should create a payment instrument for the user when 'createUserPayment' is called", done => {
      const customerNo = '12345';

      when(apiService.post(`customers/${customerNo}/payments`, anything())).thenReturn(
        of({ type: 'Link', uri: 'site/-/customers/-/payments/paymentid' })
      );
      when(apiService.resolveLink()).thenReturn(() => of(undefined));

      paymentService.createUserPayment(customerNo, newPaymentInstrument).subscribe(() => {
        verify(apiService.post(`customers/${customerNo}/payments`, anything())).once();
        done();
      });
    });

    it("should delete a payment instrument from user when 'deleteUserPaymentInstrument' is called", done => {
      when(apiService.delete(anyString())).thenReturn(of({}));

      paymentService.deleteUserPaymentInstrument('-', paymentInstrument.id).subscribe(() => {
        verify(apiService.delete(`customers/-/payments/${paymentInstrument.id}`)).once();
        done();
      });
    });

    it("should update payment instrument from customer when 'updateBasketPaymentInstrument' is called", done => {
      const userCreditCardPaymentInstrument: PaymentInstrument = {
        ...creditCardPaymentInstrument,
        urn: 'urn:payment-instrument:user:fIQKAE8B4tYAAAFu7tuO4P6T:ug8KAE8B1dcAAAFvNQqSJBQg',
      };

      when(apiService.put(anyString(), anything())).thenReturn(of({}));
      paymentService.updateConcardisCvcLastUpdated(userCreditCardPaymentInstrument).subscribe(() => {
        verify(apiService.put(`customers/-/payments/${userCreditCardPaymentInstrument.id}`, anything())).once();
        done();
      });
    });
  });
});
