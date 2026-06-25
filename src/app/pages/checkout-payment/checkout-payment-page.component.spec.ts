import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';

describe('Checkout Payment Page Component', () => {
  let component: CheckoutPaymentPageComponent;
  let fixture: ComponentFixture<CheckoutPaymentPageComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let paypalConfigService: PaypalConfigService;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([]));

    paypalConfigService = mock(PaypalConfigService);
    when(paypalConfigService.filterByPaypalEligibility(anything())).thenCall((pmList: PaymentMethod[]) =>
      of(pmList ?? [])
    );

    await TestBed.configureTestingModule({
      imports: [CheckoutPaymentPageComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalConfigService, useFactory: () => instance(paypalConfigService) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(CheckoutPaymentPageComponent, {
        remove: { imports: [CheckoutPaymentComponent] },
        add: { imports: [MockComponent(CheckoutPaymentComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render payment component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-payment')).toBeTruthy();
  });

  describe('filterByPaypalEligibility', () => {
    const invoiceMethod: PaymentMethod = {
      id: 'ISH_INVOICE',
      displayName: 'Invoice',
      serviceId: 'ISH_INVOICE',
    } as PaymentMethod;

    const creditCardMethod: PaymentMethod = {
      id: 'ISH_CREDITCARD',
      displayName: 'Credit Card',
      serviceId: 'ISH_CREDITCARD',
      capabilities: ['SomeOtherCapability'],
    } as PaymentMethod;

    const paypalExperienceMethod: PaymentMethod = {
      id: 'ISH_PAYPAL',
      displayName: 'PayPal',
      serviceId: 'PayPal',
      capabilities: ['PaypalExperienceContext'],
    } as PaymentMethod;

    const paypalWalletMethod: PaymentMethod = {
      id: 'ISH_PAYPAL_WALLET',
      displayName: 'PayPal Wallet',
      serviceId: 'PayPal',
      capabilities: ['PaypalAlternativeWallet'],
    } as PaymentMethod;

    it('should return empty array for null payment methods list', done => {
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of(undefined));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toBeEmpty();
        done();
      });
    });

    it('should return empty array for empty payment methods list', done => {
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toBeEmpty();
        done();
      });
    });

    it('should pass through non-PayPal methods without eligibility check', done => {
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([invoiceMethod, creditCardMethod]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toContain(invoiceMethod);
        expect(result).toContain(creditCardMethod);
        expect(result).toHaveLength(2);
        done();
      });
    });

    it('should include eligible PayPal method with PaypalExperienceContext capability', done => {
      when(paypalConfigService.filterByPaypalEligibility(anything())).thenReturn(of([paypalExperienceMethod]));
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([paypalExperienceMethod]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toContain(paypalExperienceMethod);
        done();
      });
    });

    it('should filter out non-eligible PayPal method with PaypalExperienceContext capability', done => {
      when(paypalConfigService.filterByPaypalEligibility(anything())).thenReturn(of([]));
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([paypalExperienceMethod]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).not.toContain(paypalExperienceMethod);
        expect(result).toHaveLength(0);
        done();
      });
    });

    it('should include eligible PayPal method with PaypalAlternativeWallet capability', done => {
      when(paypalConfigService.filterByPaypalEligibility(anything())).thenReturn(of([paypalWalletMethod]));
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([paypalWalletMethod]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toContain(paypalWalletMethod);
        done();
      });
    });

    it('should filter out non-eligible PayPal method with PaypalAlternativeWallet capability', done => {
      when(paypalConfigService.filterByPaypalEligibility(anything())).thenReturn(of([]));
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([paypalWalletMethod]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).not.toContain(paypalWalletMethod);
        expect(result).toHaveLength(0);
        done();
      });
    });

    it('should correctly filter mixed payment methods', done => {
      when(paypalConfigService.filterByPaypalEligibility(anything())).thenReturn(
        of([invoiceMethod, paypalExperienceMethod, creditCardMethod])
      );
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(
        of([invoiceMethod, paypalExperienceMethod, paypalWalletMethod, creditCardMethod])
      );
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toContain(invoiceMethod);
        expect(result).toContain(creditCardMethod);
        expect(result).toContain(paypalExperienceMethod);
        expect(result).not.toContain(paypalWalletMethod);
        expect(result).toHaveLength(3);
        done();
      });
    });

    it('should handle PayPal eligibility check failure gracefully', done => {
      when(paypalConfigService.filterByPaypalEligibility(anything())).thenReturn(of([invoiceMethod]));
      when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([invoiceMethod, paypalExperienceMethod]));
      fixture.detectChanges();

      component.paymentMethods$.subscribe(result => {
        expect(result).toContain(invoiceMethod);
        expect(result).not.toContain(paypalExperienceMethod);
        expect(result).toHaveLength(1);
        done();
      });
    });
  });
});
