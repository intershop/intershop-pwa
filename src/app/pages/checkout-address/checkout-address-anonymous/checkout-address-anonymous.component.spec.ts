import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
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
      declarations: [
        CheckoutAddressAnonymousComponent,
        MockComponent(CheckoutAddressAnonymousFormComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(IdentityProviderLoginComponent),
      ],
      imports: [
        FeatureToggleModule.forTesting('guestCheckout'),
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
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

  it('should set submitted flag if submit is clicked and form is not valid', async () => {
    expect(component.submitted).toBeFalsy();
    component.submitAddressForm();
    await fixture.whenStable();

    expect(component.submitted).toBeTruthy();
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
