import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';

import { FormlyAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-form/formly-address-form.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { RegistrationAddressFieldComponent } from './registration-address-field.component';

describe('Registration Address Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'address', component: RegistrationAddressFieldComponent }],
        }),

        FormlyTestingComponentsModule,
      ],
      declarations: [MockComponent(FormlyAddressFormComponent), RegistrationAddressFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {},
      fields: [{ type: 'address' }],
      form: new FormGroup({}),
    };

    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-registration-address-field')).toBeTruthy();
  });
});
