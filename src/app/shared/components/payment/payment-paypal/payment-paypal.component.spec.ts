import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { PaypalAdaptersBuilder } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PaypalCardFieldsAdapter } from 'ish-core/utils/paypal/adapters/paypal-card-fields/paypal-card-fields.adapter';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

import { PaymentPaypalComponent } from './payment-paypal.component';

describe('Payment Paypal Component', () => {
  let component: PaymentPaypalComponent;
  let fixture: ComponentFixture<PaymentPaypalComponent>;
  let element: HTMLElement;

  let appFacade: AppFacade;
  let paypalConfigService: PaypalConfigService;
  let paypalAdaptersBuilder: PaypalAdaptersBuilder;
  let paypalCardFields: PaypalCardFieldsAdapter;
  let router: Router;
  let closeForm$: Subject<void>;

  const paymentMethod: PaymentMethod = {
    id: 'PayPal_CARD',
    displayName: 'PayPal Card',
    saveAllowed: false,
    serviceId: '',
  };

  const paypalConfig: PaypalConfig = {
    payLaterPreferences: {
      PayLaterMessagingCartEnabled: true,
      PayLaterMessagingPaymentEnabled: true,
      PayLaterMessagingHomeEnabled: true,
      PayLaterMessagingProductDetailsEnabled: true,
      PayLaterMessagingCategoryEnabled: true,
    },
  } as PaypalConfig;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    paypalConfigService = mock(PaypalConfigService);
    paypalAdaptersBuilder = mock(PaypalAdaptersBuilder);
    paypalCardFields = mock(PaypalCardFieldsAdapter);
    router = mock(Router);
    closeForm$ = new Subject<void>();

    when(appFacade.serverSetting$('payment.paypal')).thenReturn(of(paypalConfig));
    when(paypalConfigService.loadPaypalScript(anything())).thenReturn(of({ loaded: true } as never));
    when(paypalConfigService.loadPaypalScript(anything(), anything())).thenReturn(of({ loaded: true } as never));
    when(paypalAdaptersBuilder.build(anything())).thenReturn(of(undefined));
    when(paypalCardFields.closeForm$).thenReturn(closeForm$);
    when(paypalCardFields.loadingIframe$).thenReturn(new BehaviorSubject<boolean>(false));
    when(paypalCardFields.nameFieldError$).thenReturn(new BehaviorSubject<boolean>(false));
    when(paypalCardFields.numberFieldError$).thenReturn(new BehaviorSubject<boolean>(false));
    when(paypalCardFields.cvvFieldError$).thenReturn(new BehaviorSubject<boolean>(false));
    when(paypalCardFields.expiryFieldError$).thenReturn(new BehaviorSubject<boolean>(false));
    when(router.url).thenReturn('/checkout/payment');

    await TestBed.configureTestingModule({
      imports: [PaymentPaypalComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: PaypalConfigService, useFactory: () => instance(paypalConfigService) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(PaymentPaypalComponent, {
        set: {
          providers: [
            provideTranslateService(),
            { provide: PaypalCardFieldsAdapter, useFactory: () => instance(paypalCardFields) },
            { provide: PaypalAdaptersBuilder, useFactory: () => instance(paypalAdaptersBuilder) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPaypalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pageType = 'checkout';
    resetCalls(paypalConfigService);
    resetCalls(paypalAdaptersBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('ngOnInit', () => {
    it('should emit closeForm when PayPalCardFields closeForm$ emits', () => {
      const closeFormSpy = jest.spyOn(component.closeForm, 'emit');
      fixture.detectChanges();

      closeForm$.next();

      expect(closeFormSpy).toHaveBeenCalled();
    });
  });

  describe('loadPayPalScript', () => {
    it('should not load PayPal script when component type is Messages and PayLater is not shown', () => {
      const paypalConfigWithoutPayLater: PaypalConfig = {
        ...paypalConfig,
        payLaterPreferences: {
          PayLaterMessagingCartEnabled: false,
          PayLaterMessagingPaymentEnabled: false,
          PayLaterMessagingHomeEnabled: false,
          PayLaterMessagingProductDetailsEnabled: false,
          PayLaterMessagingCategoryEnabled: false,
        },
      } as PaypalConfig;
      when(appFacade.serverSetting$('payment.paypal')).thenReturn(of(paypalConfigWithoutPayLater));
      component.adapterType = 'Messages';
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPaypalScript(anything(), anything())).never();
    });

    it('should load PayPal script for Messages component when PayLater is shown', () => {
      component.adapterType = 'Messages';
      component.pageType = 'cart';
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPaypalScript('cart')).atLeast(1);
    });

    it('should load PayPal script for Buttons component with payment method', () => {
      component.adapterType = 'Buttons';
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPaypalScript('checkout', anything())).once();
    });

    it('should load PayPal script for CardFields component with payment method', () => {
      component.adapterType = 'CardFields';
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPaypalScript('checkout', anything())).once();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should build PayPal component when script is loaded for Messages', () => {
      when(paypalConfigService.loadPaypalScript('cart')).thenReturn(of({ loaded: true } as never));
      component.adapterType = 'Messages';
      component.pageType = 'cart';
      resetCalls(paypalAdaptersBuilder);
      fixture.detectChanges();

      verify(paypalAdaptersBuilder.build(anything())).atLeast(1);
    });

    it('should build PayPal Buttons component with containerId', () => {
      component.adapterType = 'Buttons';
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalAdaptersBuilder);
      fixture.detectChanges();

      verify(paypalAdaptersBuilder.build(anything())).atLeast(1);
    });

    it('should build PayPal CardFields component', () => {
      component.adapterType = 'CardFields';
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalAdaptersBuilder);
      fixture.detectChanges();

      verify(paypalAdaptersBuilder.build(anything())).atLeast(1);
    });

    it('should not build component when script is not loaded', () => {
      when(paypalConfigService.loadPaypalScript(anything(), anything())).thenReturn(of({ loaded: false } as never));
      component.adapterType = 'Buttons';
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalAdaptersBuilder);

      fixture.detectChanges();

      verify(paypalAdaptersBuilder.build(anything())).never();
    });
  });

  describe('component configuration', () => {
    it('should have Messages as default component type', () => {
      expect(component.adapterType).toBe('Messages');
    });

    it('should generate unique paypalComponentContainerId', () => {
      const component2 = TestBed.createComponent(PaymentPaypalComponent).componentInstance;
      expect(component.paypalComponentContainerId).not.toBe(component2.paypalComponentContainerId);
      expect(component.paypalComponentContainerId).toMatch(/^paypal-container-[a-z0-9-]+$/);
    });
  });
});
