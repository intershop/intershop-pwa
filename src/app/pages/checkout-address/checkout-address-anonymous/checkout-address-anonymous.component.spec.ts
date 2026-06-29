import { NgClass } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { Basket } from 'ish-core/models/basket/basket.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { IdentityProviderLoginComponent } from 'ish-shared/components/login/identity-provider-login/identity-provider-login.component';

import { CheckoutAddressAnonymousFormComponent } from '../formly/components/checkout-address-anonymous-form/checkout-address-anonymous-form.component';

import { CheckoutAddressAnonymousComponent } from './checkout-address-anonymous.component';

describe('Checkout Address Anonymous Component', () => {
  let component: CheckoutAddressAnonymousComponent;
  let fixture: ComponentFixture<CheckoutAddressAnonymousComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [CheckoutAddressAnonymousComponent],
      providers: [
        ...(FeatureToggleModule.forTesting('guestCheckout').providers ?? []),
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(CheckoutAddressAnonymousComponent, {
        set: {
          imports: [
            MockComponent(ErrorMessageComponent),
            TranslatePipe,
            NgbCollapseModule,
            ReactiveFormsModule,
            MockComponent(IdentityProviderLoginComponent),
            NgClass,
            FeatureToggleDirective,
            MockComponent(CheckoutAddressAnonymousFormComponent),
            RouterLink,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressAnonymousComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);

    component.form = fb.group({
      additionalAddressAttributes: fb.group({
        email: new FormControl('', Validators.required),
        taxationID: new FormControl(''),
      }),
      shipOptions: fb.group({
        shipOption: new FormControl('shipToInvoiceAddress'),
      }),
      invoiceAddress: fb.group({
        address: new FormControl({}),
      }),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login container component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-identity-provider-login')).toBeTruthy();
  });

  it('should render registration link on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id="registration-link"]')).toBeTruthy();
  });

  it('should render guest checkout section when basket is not a recurring order', () => {
    component.basket = { recurrence: undefined } as Basket;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=guest-checkout]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=guest-checkout-button]')).toBeTruthy();
  });

  it('should NOT render guest checkout section when basket is a recurring order', () => {
    component.basket = { recurrence: { interval: 'P4D', startDate: '08.02.2025' } } as Basket;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=guest-checkout]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=guest-checkout-button]')).toBeFalsy();
  });

  it('should initially not show invoice address form on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=guest-checkout-button]')).toBeTruthy();
    expect(element.querySelector('div.collapse.show ish-checkout-address-anonymous-form')).toBeFalsy();
  });

  it('should show checkout-address-anonymous form if checkout as guest button is clicked', () => {
    component.isAddressFormCollapsed = false;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=guest-checkout-button]')).toBeFalsy();
    expect(element.querySelector('div.collapse.show ish-checkout-address-anonymous-form')).toBeTruthy();
  });

  it('should collapse address form when cancel is clicked', () => {
    component.isAddressFormCollapsed = false;
    fixture.detectChanges();
    component.cancelAddressForm();
    expect(component.isAddressFormCollapsed).toBeTrue();
  });

  it('should render an error when supplied', () => {
    const error = makeHttpError({ status: 404 });
    component.error = error;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should NOT create address for invalid form', () => {
    component.submitAddressForm();
    fixture.detectChanges();

    verify(checkoutFacade.createBasketAddress(anything(), anything())).never();
  });

  it('should create address for valid invoice address form', () => {
    component.form.get('additionalAddressAttributes').setValue({
      taxationID: '',
      email: 'test@intershop.de',
    });
    component.form.get('shipOptions').setValue({
      shipOption: 'shipToInvoiceAddress',
    });

    component.submitAddressForm();
    fixture.detectChanges();

    verify(checkoutFacade.createBasketAddress(anything(), anything())).once();
  });
});
