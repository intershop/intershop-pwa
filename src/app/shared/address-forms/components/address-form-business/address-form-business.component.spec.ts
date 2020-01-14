import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { AddressFormBusinessComponent } from './address-form-business.component';

describe('Address Form Business Component', () => {
  let component: AddressFormBusinessComponent;
  let fixture: ComponentFixture<AddressFormBusinessComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddressFormBusinessComponent,
        FormControlFeedbackComponent,
        InputComponent,
        MockComponent(FaIconComponent),
        MockDirective(ShowFormFeedbackDirective),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormBusinessComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const addressForm = AddressMockData.getAddressForm('DE');
    component.addressForm = addressForm;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not show form fields if it gets a private address form ', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="address-form-business"]')).toBeFalsy();
  });

  it('should show form fields if it gets a business address form ', () => {
    component.addressForm.addControl('companyName1', new FormControl());
    component.addressForm.addControl('companyName2', new FormControl());
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="address-form-business"]')).toBeTruthy();
    expect(element.querySelectorAll('input[type="text"]')).toHaveLength(2);
  });
});
