import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { PhoneFieldComponent } from './phone-field.component';

describe('Phone Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'phone', component: PhoneFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: { phone: '' },
      fields: [
        {
          key: 'phone',
          type: 'phone',
        },
      ],
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
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-phone-field')).toBeTruthy();
  });

  it('should be invalid if an incorrect phone is entered', () => {
    fixture.detectChanges();
    component.form.get('phone').setValue('123456a');
    fixture.detectChanges();
    expect(component.form.get('phone').valid).toBeFalsy();
  });
});
