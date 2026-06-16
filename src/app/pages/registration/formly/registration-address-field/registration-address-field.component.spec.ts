import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { formlyTestingImports } from 'ish-shared/formly/dev/testing/formly-testing.imports';

import { RegistrationAddressFieldComponent } from './registration-address-field.component';

@Component({
  selector: 'ish-formly-address-form',
  standalone: true,
  template: '',
})
class MockFormlyAddressFormComponent {
  @Input() businessCustomer: boolean;
  @Input() shortForm: boolean;
  @Input() parentForm: FormGroup;
}

describe('Registration Address Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ...formlyTestingImports,
        FormlyModule.forRoot({
          types: [{ name: 'address', component: RegistrationAddressFieldComponent }],
        }),
      ],
    })
      .overrideComponent(RegistrationAddressFieldComponent, {
        set: {
          imports: [MockFormlyAddressFormComponent],
        },
      })
      .compileComponents();
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
