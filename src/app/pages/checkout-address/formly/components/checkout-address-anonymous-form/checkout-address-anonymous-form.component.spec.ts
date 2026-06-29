import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyForm } from '@ngx-formly/core';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.imports';
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
      imports: [CheckoutAddressAnonymousFormComponent, FormlyTestingModule.withPresetMocks(['taxationID'])],
      providers: [
        ...(FeatureToggleModule.forTesting('businessCustomerRegistration').providers ?? []),
        provideTranslateService(),
      ],
    })
      .overrideComponent(CheckoutAddressAnonymousFormComponent, {
        set: {
          imports: [
            MockComponent(FormlyAddressFormComponent),
            MockComponent(FormlyAddressExtensionFormComponent),
            TranslatePipe,
            NgbCollapseModule,
            FormlyForm,
          ],
        },
      })
      .compileComponents();
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
});
