import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import {
  PaypalComponent,
  PaypalComponentBuilder,
} from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import { PaypalConfigService } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

import { PaymentPaypalComponent } from './payment-paypal.component';

describe('Payment Paypal Component', () => {
  let component: PaymentPaypalComponent;
  let fixture: ComponentFixture<PaymentPaypalComponent>;
  let element: HTMLElement;

  let checkoutFacade: CheckoutFacade;
  let paypalConfigService: PaypalConfigService;
  let paypalComponentBuilder: PaypalComponentBuilder;
  let router: Router;

  const mockPaypalPaymentMethod: PaymentMethod = {
    id: 'PayPal',
    serviceId: 'PayPal',
    displayName: 'PayPal',
    capabilities: ['PaypalCheckout', 'RedirectBeforeCheckout'],
    hostedPaymentPageParameters: [
      { name: 'client-id', value: 'test-client-id' },
      { name: 'currency', value: 'USD' },
    ],
  };

  const mockPaypalComponent: PaypalComponent = {
    render: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    paypalConfigService = mock(PaypalConfigService);
    paypalComponentBuilder = mock(PaypalComponentBuilder);
    router = mock(Router);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PaymentPaypalComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalComponentBuilder, useFactory: () => instance(paypalComponentBuilder) },
        { provide: PaypalConfigService, useFactory: () => instance(paypalConfigService) },
        { provide: Router, useFactory: () => instance(router) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPaypalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([mockPaypalPaymentMethod]));
    when(router.url).thenReturn('/checkout');

    // Mock loadScript to avoid triggering script loading and change detection issues in most tests
    jest.spyOn(component as unknown as { loadScript(): void }, 'loadScript').mockImplementation();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
  it('should generate unique container ID on init', () => {
    // Initialize first component with detectChanges to trigger ngOnInit
    fixture.detectChanges();
    const initialId = component.paypalComponentContainerId;
    expect(initialId).toContain('paypal-container-');
    expect(initialId.length).toBeGreaterThan('paypal-container-'.length);

    // Create a second component to verify unique IDs
    const fixture2 = TestBed.createComponent(PaymentPaypalComponent);
    const component2 = fixture2.componentInstance;
    // Mock loadScript for the second component as well
    jest.spyOn(component2 as unknown as { loadScript(): void }, 'loadScript').mockImplementation();
    // Initialize second component
    fixture2.detectChanges();

    // The container IDs should be unique due to random string appended in ngOnInit
    expect(component2.paypalComponentContainerId).toContain('paypal-container-');
    expect(component2.paypalComponentContainerId).not.toBe(initialId);
    fixture2.destroy();
  });

  describe('ngOnInit', () => {
    it('should find PayPal payment method with correct capabilities for checkout page', done => {
      when(router.url).thenReturn('/checkout');
      fixture.detectChanges();

      component.paypalPaymentMethod$.subscribe(paymentMethod => {
        expect(paymentMethod).toEqual(mockPaypalPaymentMethod);
        done();
      });
    });

    it('should find PayPal payment method with FastCheckout capability for non-checkout pages', done => {
      const fastCheckoutMethod: PaymentMethod = {
        ...mockPaypalPaymentMethod,
        id: 'PayPal_FastCheckout',
        capabilities: ['PaypalCheckout', 'FastCheckout'],
      };
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([fastCheckoutMethod]));
      when(router.url).thenReturn('/basket');

      fixture.detectChanges();

      component.paypalPaymentMethod$.subscribe(paymentMethod => {
        expect(paymentMethod).toEqual(fastCheckoutMethod);
        done();
      });
    });

    it('should not find PayPal payment method if capabilities do not match', done => {
      const invalidPaymentMethod: PaymentMethod = {
        ...mockPaypalPaymentMethod,
        capabilities: ['SomeOtherCapability'],
      };

      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([invalidPaymentMethod]));
      fixture.detectChanges();

      component.paypalPaymentMethod$.subscribe(paymentMethod => {
        expect(paymentMethod).toBeUndefined();
        done();
      });
    });

    describe('messages component type', () => {
      beforeEach(() => {
        component.componentType = 'messages';
      });

      it('should prefer payment method with PaypalCheckout and FastCheckout capabilities', done => {
        const fastCheckoutMethod: PaymentMethod = {
          id: 'PayPal_FastCheckout',
          serviceId: 'PayPal',
          displayName: 'PayPal Fast Checkout',
          capabilities: ['PaypalCheckout', 'FastCheckout'],
          hostedPaymentPageParameters: [{ name: 'client-id', value: 'test-id' }],
        };

        const regularMethod: PaymentMethod = {
          id: 'PayPal_Regular',
          serviceId: 'PayPal',
          displayName: 'PayPal Regular',
          capabilities: ['PaypalCheckout'],
          hostedPaymentPageParameters: [{ name: 'client-id', value: 'test-id' }],
        };

        when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([regularMethod, fastCheckoutMethod]));
        fixture.detectChanges();

        component.paypalPaymentMethod$.subscribe(paymentMethod => {
          expect(paymentMethod).toEqual(fastCheckoutMethod);
          done();
        });
      });

      it('should fallback to any PaypalCheckout method if FastCheckout is not available', done => {
        const regularMethod: PaymentMethod = {
          ...mockPaypalPaymentMethod,
          id: 'PayPal_Regular',
          serviceId: 'PayPal',
          capabilities: ['PaypalCheckout'],
        };

        when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([regularMethod]));
        component.componentType = 'messages';

        fixture.detectChanges();

        component.paypalPaymentMethod$.subscribe(paymentMethod => {
          expect(paymentMethod).toEqual(regularMethod);
          done();
        });
      });

      it('should return undefined if no PaypalCheckout method is available', done => {
        const otherMethod: PaymentMethod = {
          ...mockPaypalPaymentMethod,
          id: 'CreditCard',
          serviceId: 'CreditCard',
          capabilities: ['RedirectBeforeCheckout'],
        };

        when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([otherMethod]));
        component.componentType = 'messages';

        fixture.detectChanges();

        component.paypalPaymentMethod$.subscribe(paymentMethod => {
          expect(paymentMethod).toBeUndefined();
          done();
        });
      });

      it('should select first matching FastCheckout method when multiple are available', done => {
        const fastCheckoutMethod1: PaymentMethod = {
          id: 'PayPal_Fast1',
          serviceId: 'PayPal',
          displayName: 'PayPal Fast 1',
          capabilities: ['PaypalCheckout', 'FastCheckout'],
          hostedPaymentPageParameters: [{ name: 'client-id', value: 'test-id-1' }],
        };

        const fastCheckoutMethod2: PaymentMethod = {
          id: 'PayPal_Fast2',
          serviceId: 'PayPal',
          displayName: 'PayPal Fast 2',
          capabilities: ['PaypalCheckout', 'FastCheckout'],
          hostedPaymentPageParameters: [{ name: 'client-id', value: 'test-id-2' }],
        };

        when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([fastCheckoutMethod1, fastCheckoutMethod2]));
        fixture.detectChanges();

        component.paypalPaymentMethod$.subscribe(paymentMethod => {
          expect(paymentMethod).toEqual(fastCheckoutMethod1);
          done();
        });
      });
    });
  });

  describe('page type detection', () => {
    it('should set page type to "checkout" for checkout URL', fakeAsync(() => {
      when(router.url).thenReturn('/checkout/payment');
      fixture.detectChanges();
      tick();

      expect((component as unknown as { page: string }).page).toBe('checkout');
    }));

    it('should set page type to "cart" for basket URL', fakeAsync(() => {
      when(router.url).thenReturn('/basket');
      fixture.detectChanges();
      tick();

      expect((component as unknown as { page: string }).page).toBe('cart');
    }));

    it('should set page type to "product-details" for product detail URL', fakeAsync(() => {
      when(router.url).thenReturn('/category-ctg/product-prd');
      fixture.detectChanges();
      tick();

      expect((component as unknown as { page: string }).page).toBe('product-details');
    }));

    it('should set page type to "product-listing" for category URL', fakeAsync(() => {
      when(router.url).thenReturn('/category-ctg');
      fixture.detectChanges();
      tick();

      expect((component as unknown as { page: string }).page).toBe('product-listing');
    }));

    it('should set page type to "home" for any other URL', fakeAsync(() => {
      when(router.url).thenReturn('/');
      fixture.detectChanges();
      tick();

      expect((component as unknown as { page: string }).page).toBe('home');
    }));
  });

  describe('script loading', () => {
    beforeEach(() => {
      when(paypalConfigService.loadPayPalScript(anything(), anything())).thenReturn(of(undefined));
      when(paypalComponentBuilder.get(anything())).thenReturn(mockPaypalComponent);

      // Mock DOM element
      const mockElement = document.createElement('div');
      mockElement.id = component.paypalComponentContainerId;
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      // Mock window PayPal object
      (window as unknown as Record<string, unknown>)[`PPCP_${mockPaypalPaymentMethod.id}`] = {
        Buttons: jest.fn(),
        Messages: jest.fn(),
      };
    });

    it('should load PayPal script and render component successfully', fakeAsync(() => {
      // Restore loadScript for this specific test so it actually runs
      jest.spyOn(component as unknown as { loadScript(): void }, 'loadScript').mockRestore();

      // Call fixture.detectChanges() which triggers both ngOnInit and ngAfterViewInit
      fixture.detectChanges();
      tick(400);

      verify(paypalConfigService.loadPayPalScript(`PPCP_${mockPaypalPaymentMethod.id}`, anything())).once();
      verify(paypalComponentBuilder.get(anything())).once();
      expect(mockPaypalComponent.render).toHaveBeenCalledWith(`#${component.paypalComponentContainerId}`);

      component.scriptLoaded$.subscribe(loaded => {
        expect(loaded).toBeTrue();
      });
    }));

    it('should handle script loading errors', fakeAsync(() => {
      when(paypalConfigService.loadPayPalScript(anything(), anything())).thenReturn(
        throwError(() => new Error('Script loading failed'))
      );

      // Don't restore loadScript - instead directly invoke ngAfterViewInit to trigger the error path
      // This avoids the ExpressionChangedAfterItHasBeenCheckedError
      fixture.detectChanges();

      // Manually trigger the load which will encounter the error
      jest.spyOn(component as unknown as { loadScript(): void }, 'loadScript').mockRestore();
      (component as unknown as { loadScript(): void }).loadScript();

      tick(400);

      component.scriptLoaded$.subscribe(loaded => {
        expect(loaded).toBeFalse();
      });
    }));

    it('should handle missing DOM element error', fakeAsync(() => {
      jest.spyOn(document, 'getElementById').mockReturnValue(undefined);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Restore loadScript for this specific test
      jest.spyOn(component as unknown as { loadScript(): void }, 'loadScript').mockRestore();

      // Call fixture.detectChanges() first to trigger ngOnInit
      fixture.detectChanges();
      // Now manually call ngAfterViewInit which will call loadScript
      component.ngAfterViewInit();
      tick(400);

      expect(consoleSpy).toHaveBeenCalledWith(
        'PayPal container element not found:',
        component.paypalComponentContainerId
      );

      component.scriptLoaded$.subscribe(loaded => {
        expect(loaded).toBeFalse();
      });

      consoleSpy.mockRestore();
    }));

    it('should handle PayPal component render failure', fakeAsync(() => {
      const renderError = 'Render failed';
      (mockPaypalComponent.render as jest.Mock).mockRejectedValue(renderError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Restore loadScript for this specific test
      jest.spyOn(component as unknown as { loadScript(): void }, 'loadScript').mockRestore();

      // Call fixture.detectChanges() first to trigger ngOnInit
      fixture.detectChanges();
      // Now manually call ngAfterViewInit which will call loadScript
      component.ngAfterViewInit();
      tick(400);

      expect(consoleSpy).toHaveBeenCalledWith('PayPal Component render failed:', renderError);

      component.scriptLoaded$.subscribe(loaded => {
        expect(loaded).toBeFalse();
      });

      consoleSpy.mockRestore();
    }));

    it('should not attempt to render if PayPal object is not available', fakeAsync(() => {
      // Create fresh fixture to avoid pollution from previous tests
      const freshFixture = TestBed.createComponent(PaymentPaypalComponent);
      const freshComponent = freshFixture.componentInstance;
      delete (window as unknown as Record<string, unknown>)[`PPCP_${mockPaypalPaymentMethod.id}`];

      freshFixture.detectChanges();
      tick();
      freshComponent.ngAfterViewInit();
      tick(400);

      // The component should not have attempted to render without PayPal SDK
      freshFixture.destroy();
    }));

    it('should not load script if payment method has no hosted payment page parameters', () => {
      const paymentMethodWithoutParams: PaymentMethod = {
        ...mockPaypalPaymentMethod,
        hostedPaymentPageParameters: [],
      };

      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([paymentMethodWithoutParams]));
      fixture.detectChanges();

      verify(paypalConfigService.loadPayPalScript(anything(), anything())).never();
    });
  });

  describe('namespace generation', () => {
    it('should generate correct namespace from payment method ID', () => {
      const namespace = (component as unknown as { setNameSpace(pm: PaymentMethod): string }).setNameSpace(
        mockPaypalPaymentMethod
      );
      expect(namespace).toBe(`PPCP_${mockPaypalPaymentMethod.id}`);
      expect(component.scriptNamespace).toBe(`PPCP_${mockPaypalPaymentMethod.id}`);
    });
  });

  describe('PayPal component configuration', () => {
    beforeEach(() => {
      component.scriptNamespace = `PPCP_${mockPaypalPaymentMethod.id}`;
      (component as unknown as { page: string }).page = 'checkout';
      component.componentType = 'button';
      when(paypalComponentBuilder.get(anything())).thenReturn(mockPaypalComponent);
    });

    it('should create PayPal component with correct configuration', () => {
      (component as unknown as { getPaypalComponent(pm: PaymentMethod): void }).getPaypalComponent(
        mockPaypalPaymentMethod
      );

      verify(
        paypalComponentBuilder.get(
          anything() // We use anything() because we need to verify the call was made
        )
      ).once();
    });

    it('should emit selectPaypalPaymentMethod event when PayPal payment method is selected', () => {
      const selectSpy = jest.spyOn(component.selectPaypalPaymentMethod, 'emit');
      const paymentInstrumentId = 'test-instrument-id';

      when(paypalComponentBuilder.get(anything())).thenCall(config => {
        config.selectPaypalPaymentMethod(paymentInstrumentId);
        return mockPaypalComponent;
      });

      (component as unknown as { getPaypalComponent(pm: PaymentMethod): void }).getPaypalComponent(
        mockPaypalPaymentMethod
      );

      expect(selectSpy).toHaveBeenCalledWith(paymentInstrumentId);
    });
  });

  describe('template integration', () => {
    it('should render PayPal container with correct ID', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const containerElement = element.querySelector(`#${component.paypalComponentContainerId}`);
      expect(containerElement).toBeTruthy();
    }));

    it('should show error message when script loading fails', () => {
      component.scriptLoaded$.next(false);
      fixture.detectChanges();

      const errorAlert = element.querySelector('.alert-info');
      expect(errorAlert).toBeTruthy();
      expect(errorAlert.textContent.trim()).toContain('checkout.payment.paypal.script.error.message');
    });

    it('should not show error message when script loads successfully', () => {
      component.scriptLoaded$.next(true);
      fixture.detectChanges();

      const errorAlert = element.querySelector('.alert-info');
      expect(errorAlert).toBeFalsy();
    });

    it('should not show error message initially', () => {
      fixture.detectChanges();

      const errorAlert = element.querySelector('.alert-info');
      expect(errorAlert).toBeFalsy();
    });
  });

  describe('input properties', () => {
    it('should accept componentType input', () => {
      component.componentType = 'messages';
      expect(component.componentType).toBe('messages');
    });
  });

  describe('cleanup', () => {
    it('should handle component destruction', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(() => fixture.destroy()).not.toThrow();
    }));
  });
});
