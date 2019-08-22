import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { IconModule } from 'ish-core/icon.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { AddressFormContainerComponent } from '../../../../shared/address-forms/containers/address-form/address-form.container';
import { ErrorMessageComponent } from '../../../../shared/common/components/error-message/error-message.component';
import { FormsSharedModule } from '../../../../shared/forms/forms.module';

import { CheckoutAddressAnonymousComponent } from './checkout-address-anonymous.component';

describe('Checkout Address Anonymous Component', () => {
  let component: CheckoutAddressAnonymousComponent;
  let fixture: ComponentFixture<CheckoutAddressAnonymousComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    // tslint:disable-next-line:use-component-change-detection
    @Component({ template: 'dummy' })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressAnonymousComponent,
        DummyComponent,
        MockComponent(AddressFormContainerComponent),
        MockComponent(ErrorMessageComponent),
      ],
      imports: [
        FormsSharedModule,
        IconModule,
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'checkout/shipping', component: DummyComponent }]),
        TranslateModule.forRoot(),
        ngrxTesting({
          ...coreReducers,
          checkout: combineReducers(checkoutReducers),
        }),
      ],
      providers: [{ provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressAnonymousComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.get(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login container component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-login-form-container')).toBeTruthy();
  });

  it('should initially have shipping and invoice address forms on page', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-address-form-container')).toHaveLength(2);
  });

  it('should initially not show invoice address form on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=guest-checkout-button]')).toBeTruthy();
    expect(element.querySelector('div.collapse.show ish-address-form-container')).toBeFalsy();
  });

  it('should show invoice address form if checkout as guest button is clicked', () => {
    component.isAddressFormCollapsed = false;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=guest-checkout-button]')).toBeFalsy();
    expect(element.querySelector('div.collapse.show ish-address-form-container')).toBeTruthy();
    expect(component.form.controls.shipOption.value).toEqual('shipToInvoiceAddress');
    expect(
      element.querySelector('div.collapse.show[data-testing-id=shipping-address-form] ish-address-form-container')
    ).toBeFalsy();
  });

  it('should collapse address form when cancel is clicked', () => {
    component.isAddressFormCollapsed = false;
    fixture.detectChanges();
    component.cancelAddressForm();
    expect(component.isAddressFormCollapsed).toBeTrue();
  });

  it('should render an error when supplied', () => {
    const error = { status: 404 } as HttpError;
    component.error = error;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should set submitted flag if submit is clicked and form is not valid', async(() => {
    component.form = new FormGroup({
      email: new FormControl('', Validators.required),
    });
    expect(component.submitted).toBeFalsy();
    component.submitAddressForm();
    fixture.whenStable().then(() => {
      expect(component.submitted).toBeTruthy();
    });
  }));

  it('should NOT throw create event for invalid form', done => {
    component.form = new FormGroup({
      email: new FormControl('', Validators.required),
    });

    component.createBasketAddress.subscribe(() => {
      fail();
      done();
    });

    component.submitAddressForm();
    fixture.detectChanges();

    done();
  });

  it('should throw create event for valid invoice address form', done => {
    component.form = fb.group({
      email: new FormControl(''),
      shipOption: new FormControl('shipToInvoiceAddress'),
    });
    component.invoiceAddressForm = fb.group({
      address: new FormControl({}),
    });

    component.createBasketAddress.subscribe(() => {
      done();
    });

    component.submitAddressForm();
    fixture.detectChanges();
  });
});
