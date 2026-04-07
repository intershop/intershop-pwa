import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { PaypalGooglePayAdapter } from 'ish-core/utils/paypal/adapters/paypal-google-pay/paypal-google-pay.adapter';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalConfigService } from './paypal-config.service';

describe('Paypal Config Service', () => {
  let service: PaypalConfigService;
  let appFacade: AppFacade;
  let scriptLoader: ScriptLoaderService;
  const windowRef = window as unknown as Record<string, unknown>;

  const mockPaymentMethod: PaymentMethod = {
    id: 'ISH_PAYPAL',
    serviceId: 'PayPal',
    displayName: 'PayPal',
    capabilities: ['RedirectAfterCheckout'],
    hostedPaymentPageParameters: [
      { name: 'client-id', value: 'test-client-id' },
      { name: 'merchant-id', value: 'test-merchant-id' },
      { name: 'intent', value: 'capture' },
      { name: 'data-partner-attribution-id', value: 'test-attribution-id' },
      { name: 'data-client-metadata-id', value: 'test-metadata-id' },
    ],
  } as PaymentMethod;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    scriptLoader = mock(ScriptLoaderService);

    when(appFacade.currentLocale$).thenReturn(of('en_US'));
    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(appFacade.serverSetting$<PaypalConfig>('payment.paypal')).thenReturn(
      of({
        clientId: 'test-client-id',
        merchantId: 'test-merchant-id',
        payLaterPreferences: {
          PayLaterEnabled: true,
          PayLaterMessagingCartEnabled: false,
          PayLaterMessagingCategoryEnabled: false,
          PayLaterMessagingHomeEnabled: false,
          PayLaterMessagingPaymentEnabled: false,
          PayLaterMessagingProductDetailsEnabled: false,
        },
      })
    );
    when(appFacade.appBecameStable$).thenReturn(of(true));
    when(scriptLoader.load(anything(), anything())).thenReturn(
      of({ src: 'https://www.paypal.com/sdk/js', loaded: true })
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoader) },
      ],
    });

    service = TestBed.inject(PaypalConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadPayPalScript', () => {
    it('should be a function', () => {
      expect(typeof service.loadPaypalScript).toBe('function');
    });

    it('should call scriptLoader.load with correct URL and attributes', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        verify(scriptLoader.load(anything(), anything())).once();
        done();
      });
    });

    it('should include namespace in script attributes', done => {
      service.loadPaypalScript('cart', mockPaymentMethod).subscribe(() => {
        const [, options] = capture(scriptLoader.load).last();
        const namespaceAttr = options.attributes.find((attr: { name: string }) => attr.name === 'data-namespace');
        expect(namespaceAttr?.value).toBe('PPCP_ISH_PAYPAL');
        done();
      });
    });

    it('should include page type in script attributes', done => {
      service.loadPaypalScript('product-details', mockPaymentMethod).subscribe(() => {
        const [, options] = capture(scriptLoader.load).last();
        const pageTypeAttr = options.attributes.find((attr: { name: string }) => attr.name === 'data-page-type');
        expect(pageTypeAttr?.value).toBe('product-details');
        done();
      });
    });

    it('should include partner attribution ID in script attributes', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [, options] = capture(scriptLoader.load).last();
        const attrId = options.attributes.find((attr: { name: string }) => attr.name === 'data-partner-attribution-id');
        expect(attrId?.value).toBe('test-attribution-id');
        done();
      });
    });

    it('should include data-* parameters from payment method in script attributes', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [, options] = capture(scriptLoader.load).last();
        const dataAttr = options.attributes.find((attr: { name: string }) => attr.name === 'data-client-metadata-id');
        expect(dataAttr?.value).toBe('test-metadata-id');
        done();
      });
    });

    it('should construct URL with client-id parameter', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('client-id=test-client-id');
        done();
      });
    });

    it('should construct URL with merchant-id parameter', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('merchant-id=test-merchant-id');
        done();
      });
    });

    it('should construct URL with intent parameter', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('intent=capture');
        done();
      });
    });

    it('should construct URL with components parameter', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('components=buttons,messages,card-fields');
        done();
      });
    });

    it('should construct URL with current locale', done => {
      when(appFacade.currentLocale$).thenReturn(of('de_DE'));

      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('locale=de_DE');
        done();
      });
    });

    it('should construct URL with current currency', done => {
      when(appFacade.currentCurrency$).thenReturn(of('EUR'));

      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('currency=EUR');
        done();
      });
    });

    it('should not include commit=false when RedirectAfterCheckout capability is present', done => {
      const paymentMethodWithRedirect = {
        ...mockPaymentMethod,
        capabilities: ['RedirectAfterCheckout'],
      };

      service.loadPaypalScript('checkout', paymentMethodWithRedirect).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).not.toContain('commit=false');
        done();
      });
    });

    it('should include commit=false when RedirectAfterCheckout capability is not present', done => {
      const paymentMethodWithoutRedirect = {
        ...mockPaymentMethod,
        capabilities: [] as string[],
      };

      service.loadPaypalScript('checkout', paymentMethodWithoutRedirect).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('commit=false');
        done();
      });
    });

    it('should include enable-funding=paylater when Pay Later is enabled', done => {
      when(appFacade.serverSetting$<PaypalConfig>('payment.paypal')).thenReturn(
        of({
          clientId: 'test',
          merchantId: 'test',
          payLaterPreferences: {
            PayLaterEnabled: true,
            PayLaterMessagingCartEnabled: false,
            PayLaterMessagingCategoryEnabled: false,
            PayLaterMessagingHomeEnabled: false,
            PayLaterMessagingPaymentEnabled: false,
            PayLaterMessagingProductDetailsEnabled: false,
          },
        })
      );

      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('enable-funding=paylater');
        done();
      });
    });

    it('should not include enable-funding=paylater when Pay Later is disabled', done => {
      when(appFacade.serverSetting$<PaypalConfig>('payment.paypal')).thenReturn(
        of({
          clientId: 'test',
          merchantId: 'test',
          payLaterPreferences: {
            PayLaterEnabled: false,
            PayLaterMessagingCartEnabled: false,
            PayLaterMessagingCategoryEnabled: false,
            PayLaterMessagingHomeEnabled: false,
            PayLaterMessagingPaymentEnabled: false,
            PayLaterMessagingProductDetailsEnabled: false,
          },
        })
      );

      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).not.toContain('enable-funding=paylater');
        done();
      });
    });

    it('should always include disable-funding=card,sepa', done => {
      service.loadPaypalScript('checkout', mockPaymentMethod).subscribe(() => {
        const [url] = capture(scriptLoader.load).last();
        expect(url).toContain('disable-funding=card,sepa');
        done();
      });
    });

    it('should handle payment method without hostedPaymentPageParameters', done => {
      const minimalPaymentMethod = {
        id: 'ISH_PAYPAL',
        serviceId: 'PayPal',
        displayName: 'PayPal',
        capabilities: [] as string[],
        hostedPaymentPageParameters: undefined,
      } as PaymentMethod;

      service.loadPaypalScript('checkout', minimalPaymentMethod).subscribe(() => {
        verify(scriptLoader.load(anything(), anything())).once();
        done();
      });
    });

    it('should support all page types', done => {
      const pageTypes: ('cart' | 'checkout' | 'home' | 'product-details' | 'product-listing')[] = [
        'cart',
        'checkout',
        'home',
        'product-details',
        'product-listing',
      ];

      let completedCalls = 0;

      pageTypes.forEach(pageType => {
        service.loadPaypalScript(pageType, mockPaymentMethod).subscribe(() => {
          completedCalls++;
          if (completedCalls === pageTypes.length) {
            done();
          }
        });
      });
    });
  });

  describe('filterByPaypalEligibility', () => {
    beforeEach(() => {
      // Clean up window object before each test
      delete windowRef.PPCP_ISH_PAYPAL;
      delete windowRef.PPCP_ISH_PAYPAL_CARD;
      delete windowRef.PPCP_ISH_PAYPAL_GOOGLEPAY;
      delete windowRef.PPCP_ISH_PAYPAL_INELIGIBLE;
      delete windowRef.google;
    });

    afterEach(() => {
      // Clean up window object after each test
      delete windowRef.PPCP_ISH_PAYPAL;
      delete windowRef.PPCP_ISH_PAYPAL_CARD;
      delete windowRef.PPCP_ISH_PAYPAL_GOOGLEPAY;
      delete windowRef.PPCP_ISH_PAYPAL_INELIGIBLE;
      delete windowRef.google;
    });

    it('should return empty array when input is null', async () => {
      // eslint-disable-next-line unicorn/no-null
      const result = await firstValueFrom(service.filterByPaypalEligibility(null));
      expect(result).toBeEmpty();
    });

    it('should return empty array when input is undefined', async () => {
      const result = await firstValueFrom(service.filterByPaypalEligibility(undefined));
      expect(result).toBeEmpty();
    });

    it('should return empty array when input is empty array', async () => {
      const result = await firstValueFrom(service.filterByPaypalEligibility([]));
      expect(result).toBeEmpty();
    });

    it('should pass through non-PayPal payment methods without eligibility check', async () => {
      const nonPaypalMethod: PaymentMethod = {
        id: 'INVOICE',
        serviceId: 'Invoice',
        displayName: 'Invoice',
        capabilities: [],
      } as PaymentMethod;

      const result = await firstValueFrom(service.filterByPaypalEligibility([nonPaypalMethod]));

      expect(result).toEqual([nonPaypalMethod]);
      verify(scriptLoader.load(anything(), anything())).never();
    });

    it('should check eligibility for payment methods with PaypalExperienceContext capability', async () => {
      const paypalMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_CARD',
        capabilities: ['PaypalExperienceContext'],
      };

      windowRef.PPCP_ISH_PAYPAL_CARD = {
        CardFields: () => ({ isEligible: () => true }),
      };

      const result = await firstValueFrom(service.filterByPaypalEligibility([paypalMethod]));

      expect(result).toEqual([paypalMethod]);
      verify(scriptLoader.load(anything(), anything())).once();
    });

    it('should check eligibility for payment methods with PaypalAlternativeWallet capability', async () => {
      const paypalGooglePayMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_GOOGLEPAY',
        capabilities: ['PaypalAlternativeWallet', 'PaypalGooglePay'],
      };

      const mockGooglePayConfig = {
        allowedPaymentMethods: [{ type: 'CARD' }],
        merchantInfo: { merchantId: 'test-merchant' },
      };

      windowRef.PPCP_ISH_PAYPAL_GOOGLEPAY = {
        Googlepay: () => ({
          config: () => Promise.resolve(mockGooglePayConfig),
        }),
      };

      // Mock Google Pay SDK load
      when(scriptLoader.load(PaypalGooglePayAdapter.GOOGLE_PAY_SDK_URL)).thenReturn(
        of({ src: PaypalGooglePayAdapter.GOOGLE_PAY_SDK_URL, loaded: true })
      );

      // Mock paypalClientConfig$
      when(appFacade.paypalClientConfig$()).thenReturn(of({ googlePayEnvironment: 'TEST' }));

      // Mock Google Pay PaymentsClient
      windowRef.google = {
        payments: {
          api: {
            PaymentsClient: class {
              isReadyToPay() {
                return Promise.resolve({ result: true });
              }
            },
          },
        },
      };

      const result = await firstValueFrom(service.filterByPaypalEligibility([paypalGooglePayMethod]));

      expect(result).toEqual([paypalGooglePayMethod]);
      verify(scriptLoader.load(anything(), anything())).once();
    });

    it('should filter out ineligible PayPal payment methods', async () => {
      const paypalMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_CARD',
        capabilities: ['PaypalExperienceContext'],
      };

      windowRef.PPCP_ISH_PAYPAL_CARD = {
        CardFields: () => ({ isEligible: () => false }),
      };

      const result = await firstValueFrom(service.filterByPaypalEligibility([paypalMethod]));

      expect(result).toBeEmpty();
    });

    it('should handle mix of eligible and ineligible payment methods', async () => {
      const invoiceMethod: PaymentMethod = {
        id: 'INVOICE',
        serviceId: 'Invoice',
        displayName: 'Invoice',
        capabilities: [],
      } as PaymentMethod;

      const eligiblePaypalMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_CARD',
        capabilities: ['PaypalExperienceContext'],
      };

      const ineligiblePaypalMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_INELIGIBLE',
        capabilities: ['PaypalExperienceContext'],
      };

      windowRef.PPCP_ISH_PAYPAL_CARD = {
        CardFields: () => ({ isEligible: () => true }),
      };
      windowRef.PPCP_ISH_PAYPAL_INELIGIBLE = {
        CardFields: () => ({ isEligible: () => false }),
      };

      const result = await firstValueFrom(
        service.filterByPaypalEligibility([invoiceMethod, eligiblePaypalMethod, ineligiblePaypalMethod])
      );

      expect(result).toHaveLength(2);
      expect(result).toContain(invoiceMethod);
      expect(result).toContain(eligiblePaypalMethod);
      expect(result).not.toContain(ineligiblePaypalMethod);
    });

    it('should preserve order of payment methods', async () => {
      const method1: PaymentMethod = { id: 'METHOD_1', capabilities: [] } as PaymentMethod;
      const method2: PaymentMethod = { id: 'METHOD_2', capabilities: [] } as PaymentMethod;
      const method3: PaymentMethod = { id: 'METHOD_3', capabilities: [] } as PaymentMethod;

      const result = await firstValueFrom(service.filterByPaypalEligibility([method1, method2, method3]));

      expect(result).toEqual([method1, method2, method3]);
    });

    it('should return all methods when all are eligible', async () => {
      const invoiceMethod: PaymentMethod = {
        id: 'INVOICE',
        capabilities: [],
      } as PaymentMethod;

      const creditCardMethod: PaymentMethod = {
        id: 'CREDIT_CARD',
        capabilities: [],
      } as PaymentMethod;

      const paypalMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_CARD',
        capabilities: ['PaypalExperienceContext'],
      };

      windowRef.PPCP_ISH_PAYPAL_CARD = {
        CardFields: () => ({ isEligible: () => true }),
      };

      const result = await firstValueFrom(
        service.filterByPaypalEligibility([invoiceMethod, creditCardMethod, paypalMethod])
      );

      expect(result).toHaveLength(3);
    });

    it('should return only non-PayPal methods when all PayPal methods are ineligible', async () => {
      const invoiceMethod: PaymentMethod = {
        id: 'INVOICE',
        capabilities: [],
      } as PaymentMethod;

      const paypalMethod: PaymentMethod = {
        ...mockPaymentMethod,
        id: 'ISH_PAYPAL_CARD',
        capabilities: ['PaypalExperienceContext'],
      };

      windowRef.PPCP_ISH_PAYPAL_CARD = {
        CardFields: () => ({ isEligible: () => false }),
      };

      const result = await firstValueFrom(service.filterByPaypalEligibility([invoiceMethod, paypalMethod]));

      expect(result).toEqual([invoiceMethod]);
    });
  });
});
