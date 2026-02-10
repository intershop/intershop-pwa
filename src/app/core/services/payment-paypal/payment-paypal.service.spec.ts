import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { getBasketIdOrCurrent } from 'ish-core/store/customer/basket';

import { PaymentPaypalService } from './payment-paypal.service';

describe('Payment Paypal Service', () => {
  let paymentPaypalService: PaymentPaypalService;
  let apiServiceMock: ApiService;
  let paymentServiceMock: PaymentService;

  const mockPaymentInstrument: PaymentInstrument = {
    id: 'paypal-instrument-id',
    paymentMethod: 'PayPal',
  };

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    paymentServiceMock = mock(PaymentService);
    when(apiServiceMock.currentBasketEndpoint()).thenReturn(instance(apiServiceMock));
    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);
    when(paymentServiceMock.createBasketPayment(anything())).thenReturn(of(mockPaymentInstrument));
    when(paymentServiceMock.setBasketPayment(anyString())).thenReturn(of('en_US'));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: APP_BASE_HREF, useFactory: () => '/' },
        { provide: PaymentService, useFactory: () => instance(paymentServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getCurrentLocale, value: 'en_US' },
            { selector: getBasketIdOrCurrent, value: 'current' },
          ],
        }),
      ],
    });

    paymentPaypalService = TestBed.inject(PaymentPaypalService);
  });

  describe('PayPal experience context', () => {
    it("should initialize PayPal experience context flow when 'initializePayPalExperienceContextFlow' is called", done => {
      when(apiServiceMock.put(anyString(), anything(), anything())).thenReturn(
        of({
          data: {
            orderId: 'PAYPAL_ORDER_123',
          },
        })
      );

      paymentPaypalService.initializePaypalExperienceContextFlow(mockPaymentInstrument).subscribe(result => {
        verify(paymentServiceMock.createBasketPayment(mockPaymentInstrument)).once();
        verify(paymentServiceMock.setBasketPayment('paypal-instrument-id')).once();
        verify(apiServiceMock.put('payments/open-tender/paypal-experience-context', anything(), anything())).once();
        expect(capture(apiServiceMock.put).last()?.[1]).toMatchInlineSnapshot(`
          {
            "experienceContext": {
              "cancelUrl": "http://localhost/checkout/payment;lang=en_US?redirect=cancel",
              "returnUrl": "http://localhost/checkout/review;lang=en_US?redirect=success",
            },
          }
        `);
        expect(result).toEqual({ orderId: 'PAYPAL_ORDER_123', paymentInstrumentId: 'paypal-instrument-id' });
        done();
      });
    });

    it("should get PayPal payment instrument data when 'getPayPalPaymentInstrument' is called", done => {
      when(apiServiceMock.get(anyString(), anything())).thenReturn(
        of({
          data: {
            orderId: 'PAYPAL_ORDER_123',
            card: {
              brand: 'VISA',
              expiry: '2025-12',
              lastDigits: '1234',
            },
            name: 'John Doe',
          },
        })
      );

      paymentPaypalService.getPaypalPaymentInstrument(mockPaymentInstrument).subscribe(result => {
        verify(apiServiceMock.get('payments/open-tender/paypal-experience-context', anything())).once();
        expect(result).toEqual({
          id: 'paypal-instrument-id',
          paymentMethod: 'PayPal',
          parameters: [
            { name: 'orderId', value: 'PAYPAL_ORDER_123' },
            { name: 'brand', value: 'VISA' },
            { name: 'expiry', value: '2025-12' },
            { name: 'lastDigits', value: '1234' },
            { name: 'cardHolder', value: 'John Doe' },
          ],
        });
        done();
      });
    });

    it("should return error message when 'getPayPalPaymentInstrument' receives 3DS decline", done => {
      when(apiServiceMock.get(anyString(), anything())).thenReturn(
        of({
          data: {
            orderId: 'PAYPAL_ORDER_123',
            card: {
              brand: 'VISA',
              threeDSecureDecision: 'DECLINE',
            },
          },
          infos: [{ message: '3D Secure authentication failed' }],
        })
      );

      paymentPaypalService.getPaypalPaymentInstrument(mockPaymentInstrument).subscribe(result => {
        expect(result).toEqual({ errorMessage: '3D Secure authentication failed' });
        done();
      });
    });

    it("should handle missing card data when 'getPayPalPaymentInstrument' is called", done => {
      when(apiServiceMock.get(anyString(), anything())).thenReturn(
        of({
          data: {
            orderId: 'PAYPAL_ORDER_123',
            name: 'John Doe',
          },
        })
      );

      paymentPaypalService.getPaypalPaymentInstrument(mockPaymentInstrument).subscribe(result => {
        expect(result).toEqual({
          id: 'paypal-instrument-id',
          paymentMethod: 'PayPal',
          parameters: [
            { name: 'orderId', value: 'PAYPAL_ORDER_123' },
            { name: 'brand', value: '' },
            { name: 'expiry', value: '' },
            { name: 'lastDigits', value: '' },
            { name: 'cardHolder', value: 'John Doe' },
          ],
        });
        done();
      });
    });
  });
});
