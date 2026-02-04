/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { Subject, of } from 'rxjs';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { PayPalCardFields } from 'ish-core/utils/sdk/paypal/paypal-components/card-fields/paypal-card-fields';
import { PaypalComponentBuilder } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.builder';
import {
  PaypalComponentTypes,
  PaypalConfigService,
  PaypalPageTypes,
} from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

import { PaymentPaypalComponent } from './payment-paypal.component';

describe('Payment Paypal Component', () => {
  let component: PaymentPaypalComponent;
  let fixture: ComponentFixture<PaymentPaypalComponent>;
  let element: HTMLElement;

  let appFacade: AppFacade;
  let paypalConfigService: PaypalConfigService;
  let paypalComponentBuilder: PaypalComponentBuilder;
  let payPalCardFields: PayPalCardFields;
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
    paypalComponentBuilder = mock(PaypalComponentBuilder);
    payPalCardFields = mock(PayPalCardFields);
    router = mock(Router);
    closeForm$ = new Subject<void>();

    when(appFacade.serverSetting$('payment.paypal')).thenReturn(of(paypalConfig));
    when(paypalConfigService.loadPayPalScript(anything(), anything(), anything())).thenReturn(
      of({ loaded: true } as never)
    );
    when(paypalComponentBuilder.build(anything())).thenReturn(of(undefined));
    when(payPalCardFields.closeForm$).thenReturn(closeForm$);
    when(router.url).thenReturn('/checkout/payment');

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), MockDirective(NgbPopover), PaymentPaypalComponent],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: PayPalCardFields, useFactory: () => instance(payPalCardFields) },
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
    resetCalls(paypalConfigService);
    resetCalls(paypalComponentBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('ngOnInit', () => {
    it('should identify page type as CheckoutPayment for checkout/payment URL', () => {
      when(router.url).thenReturn('/checkout/payment');
      fixture.detectChanges();
      expect((component as any).getPage()).toBe(PaypalPageTypes.CheckoutPayment);
    });

    it('should identify page type as Cart for basket URL', () => {
      when(router.url).thenReturn('/basket');
      fixture.detectChanges();
      expect((component as any).getPage()).toBe(PaypalPageTypes.Cart);
    });

    it('should identify page type as ProductDetails for product detail URL', () => {
      when(router.url).thenReturn('/category-ctg/product-prd');
      fixture.detectChanges();
      expect((component as any).getPage()).toBe(PaypalPageTypes.ProductDetails);
    });

    it('should identify page type as ProductListing for category URL', () => {
      when(router.url).thenReturn('/category-ctg');
      fixture.detectChanges();
      expect((component as any).getPage()).toBe(PaypalPageTypes.ProductListing);
    });

    it('should identify page type as Home for home URL', () => {
      when(router.url).thenReturn('/home');
      fixture.detectChanges();
      expect((component as any).getPage()).toBe(PaypalPageTypes.Home);
    });

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
      component.componentType = PaypalComponentTypes.Messages;
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPayPalScript(anything(), anything(), anything())).never();
    });

    it('should load PayPal script for Messages component when PayLater is shown', () => {
      component.componentType = PaypalComponentTypes.Messages;
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPayPalScript('PPCP_MESSAGES', anything())).once();
    });

    it('should load PayPal script for Buttons component with payment method', () => {
      component.componentType = PaypalComponentTypes.Buttons;
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPayPalScript('PPCP_PayPal_CARD', anything(), anything())).once();
    });

    it('should load PayPal script for CardFields component with payment method', () => {
      component.componentType = PaypalComponentTypes.CardFields;
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalConfigService);

      fixture.detectChanges();

      verify(paypalConfigService.loadPayPalScript('PPCP_PayPal_CARD', anything(), anything())).once();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should build PayPal component when script is loaded for Messages', () => {
      when(paypalConfigService.loadPayPalScript('PPCP_MESSAGES', anything())).thenReturn(of({ loaded: true } as never));
      component.componentType = PaypalComponentTypes.Messages;
      resetCalls(paypalComponentBuilder);
      fixture.detectChanges();

      verify(paypalComponentBuilder.build(anything())).once();
    });

    it('should build PayPal Buttons component with containerId', () => {
      component.componentType = PaypalComponentTypes.Buttons;
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalComponentBuilder);
      fixture.detectChanges();

      verify(paypalComponentBuilder.build(anything())).once();
    });

    it('should build PayPal CardFields component', () => {
      component.componentType = PaypalComponentTypes.CardFields;
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalComponentBuilder);
      fixture.detectChanges();

      verify(paypalComponentBuilder.build(anything())).once();
    });

    it('should not build component when script is not loaded', () => {
      when(paypalConfigService.loadPayPalScript(anything(), anything(), anything())).thenReturn(
        of({ loaded: false } as never)
      );
      component.componentType = PaypalComponentTypes.Buttons;
      component.selectedPaymentMethod = paymentMethod;
      resetCalls(paypalComponentBuilder);

      fixture.detectChanges();

      verify(paypalComponentBuilder.build(anything())).never();
    });
  });

  describe('component configuration', () => {
    it('should have Messages as default component type', () => {
      expect(component.componentType).toBe(PaypalComponentTypes.Messages);
    });

    it('should generate unique paypalComponentContainerId', () => {
      const component2 = TestBed.createComponent(PaymentPaypalComponent).componentInstance;
      expect(component.paypalComponentContainerId).not.toBe(component2.paypalComponentContainerId);
      expect(component.paypalComponentContainerId).toMatch(/^paypal-container-[a-z0-9]+$/);
    });
  });
});
