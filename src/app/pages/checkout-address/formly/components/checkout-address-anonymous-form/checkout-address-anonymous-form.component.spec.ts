import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { FormlyAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-form/formly-address-form.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';
import { FormlyTestingFieldgroupExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-fieldgroup-example/formly-testing-fieldgroup-example.component';

import { CheckoutAddressAnonymousFormComponent } from './checkout-address-anonymous-form.component';

describe('Checkout Address Anonymous Form Component', () => {
  let component: CheckoutAddressAnonymousFormComponent;
  let fixture: ComponentFixture<CheckoutAddressAnonymousFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;
  let featureToggleService: FeatureToggleService;

  beforeEach(async () => {
    featureToggleService = mock(FeatureToggleService);
    await TestBed.configureTestingModule({
      declarations: [CheckoutAddressAnonymousFormComponent, MockComponent(FormlyAddressFormComponent)],
      imports: [
        FormlyModule.forRoot({
          types: [
            { name: 'ish-text-input-field', component: FormlyTestingExampleComponent },
            { name: 'ish-fieldset-field', component: FormlyTestingFieldgroupExampleComponent },
            { name: 'ish-email-field', component: FormlyTestingExampleComponent },
            { name: 'ish-radio-field', component: FormlyTestingExampleComponent },
          ],
        }),
        FormlyTestingComponentsModule,
        NgbCollapseModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: FeatureToggleService, useFactory: () => instance(featureToggleService) }],
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

  it('should set input field for taxation-id, when businessCustomerRegistration feature is enabled', () => {
    when(featureToggleService.enabled('businessCustomerRegistration')).thenReturn(of(true));
    fixture.detectChanges();
    expect(component.parentForm.get('additionalAddressAttributes').value).toContainKey('taxationID');
  });

  it('should add shipping address form to parent form, when shipOption is set to shipToDifferentAddress', () => {
    fixture.detectChanges();

    component.form.get('shipOption').setValue('shipToDifferentAddress');

    fixture.detectChanges();

    expect(component.isShippingAddressFormExpanded).toBeTrue();
    expect(component.parentForm.get('shippingAddress')).toBeTruthy();
  });
});
