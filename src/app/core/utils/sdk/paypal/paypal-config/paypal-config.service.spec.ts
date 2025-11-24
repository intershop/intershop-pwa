import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalConfigService } from './paypal-config.service';

describe('Paypal Config Service', () => {
  let service: PaypalConfigService;
  let appFacade: AppFacade;
  let scriptLoader: ScriptLoaderService;

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
    when(appFacade.payPalConfig$).thenReturn(of({ payLaterButtonEnabled: false }));
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
      expect(typeof service.loadPayPalScript).toBe('function');
    });

    it('should call scriptLoader.load with correct URL and attributes', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          verify(scriptLoader.load(anything(), anything())).once();
          done();
        });
    });

    it('should include namespace in script attributes', done => {
      service
        .loadPayPalScript('custom-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'cart',
        })
        .subscribe(() => {
          const [, options] = capture(scriptLoader.load).last();
          const namespaceAttr = options.attributes.find((attr: { name: string }) => attr.name === 'data-namespace');
          expect(namespaceAttr?.value).toBe('custom-namespace');
          done();
        });
    });

    it('should include page type in script attributes', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'product-details',
        })
        .subscribe(() => {
          const [, options] = capture(scriptLoader.load).last();
          const pageTypeAttr = options.attributes.find((attr: { name: string }) => attr.name === 'data-page-type');
          expect(pageTypeAttr?.value).toBe('product-details');
          done();
        });
    });

    it('should include partner attribution ID in script attributes', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [, options] = capture(scriptLoader.load).last();
          const attrId = options.attributes.find(
            (attr: { name: string }) => attr.name === 'data-partner-attribution-id'
          );
          expect(attrId?.value).toBe('test-attribution-id');
          done();
        });
    });

    it('should include data-* parameters from payment method in script attributes', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [, options] = capture(scriptLoader.load).last();
          const dataAttr = options.attributes.find((attr: { name: string }) => attr.name === 'data-client-metadata-id');
          expect(dataAttr?.value).toBe('test-metadata-id');
          done();
        });
    });

    it('should construct URL with client-id parameter', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('client-id=test-client-id');
          done();
        });
    });

    it('should construct URL with merchant-id parameter', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('merchant-id=test-merchant-id');
          done();
        });
    });

    it('should construct URL with intent parameter', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('intent=capture');
          done();
        });
    });

    it('should construct URL with components parameter', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('components=buttons,messages');
          done();
        });
    });

    it('should construct URL with current locale', done => {
      when(appFacade.currentLocale$).thenReturn(of('de_DE'));

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('locale=de_DE');
          done();
        });
    });

    it('should construct URL with current currency', done => {
      when(appFacade.currentCurrency$).thenReturn(of('EUR'));

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
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

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: paymentMethodWithRedirect,
          page: 'checkout',
        })
        .subscribe(() => {
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

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: paymentMethodWithoutRedirect,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('commit=false');
          done();
        });
    });

    it('should include enable-funding=paylater when Pay Later is enabled', done => {
      when(appFacade.payPalConfig$).thenReturn(of({ payLaterButtonEnabled: true }));

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).toContain('enable-funding=paylater');
          done();
        });
    });

    it('should not include enable-funding=paylater when Pay Later is disabled', done => {
      when(appFacade.payPalConfig$).thenReturn(of({ payLaterButtonEnabled: false }));

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
          const [url] = capture(scriptLoader.load).last();
          expect(url).not.toContain('enable-funding=paylater');
          done();
        });
    });

    it('should always include disable-funding=card,sepa', done => {
      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: mockPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
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

      service
        .loadPayPalScript('test-namespace', {
          paymentMethod: minimalPaymentMethod,
          page: 'checkout',
        })
        .subscribe(() => {
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
        service
          .loadPayPalScript('test-namespace', {
            paymentMethod: mockPaymentMethod,
            page: pageType,
          })
          .subscribe(() => {
            completedCalls++;
            if (completedCalls === pageTypes.length) {
              done();
            }
          });
      });
    });
  });
});
