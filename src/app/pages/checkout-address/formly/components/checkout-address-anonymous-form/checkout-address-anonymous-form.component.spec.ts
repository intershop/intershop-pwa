import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { FormlyAddressExtensionFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-extension-form/formly-address-extension-form.component';
import { FormlyAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-form/formly-address-form.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { CheckoutAddressAnonymousFormComponent } from './checkout-address-anonymous-form.component';

describe('Checkout Address Anonymous Form Component', () => {
  let component: CheckoutAddressAnonymousFormComponent;
  let fixture: ComponentFixture<CheckoutAddressAnonymousFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressAnonymousFormComponent,
        MockComponent(FormlyAddressExtensionFormComponent),
        MockComponent(FormlyAddressFormComponent),
      ],
      imports: [
        FeatureToggleModule.forTesting('businessCustomerRegistration'),
        FormlyTestingModule.withPresetMocks(['taxationID']),
        NgbCollapseModule,
        TranslatePipe,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressAnonymousFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);

    component.parentForm = fb.group({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should add shipping address form to parent form, when shipOption is set to shipToDifferentAddress', () => {
    fixture.detectChanges();

    component.shipOptionForm.get('shipOption').setValue('shipToDifferentAddress');

    fixture.detectChanges();

    expect(component.isShippingAddressFormExpanded).toBeTrue();
    expect(component.parentForm.get('shippingAddress')).toBeTruthy();
  });

  it('should render address forms without email and delegate the single email field to the extension form', () => {
    fixture.detectChanges();

    const addressForms = fixture.debugElement.queryAll(By.directive(FormlyAddressFormComponent));
    expect(addressForms).not.toBeEmpty();
    addressForms.forEach(addressForm => {
      expect((addressForm.componentInstance as FormlyAddressFormComponent).email).toBeFalse();
    });

    expect(fixture.debugElement.query(By.directive(FormlyAddressExtensionFormComponent))).toBeTruthy();
  });
});
