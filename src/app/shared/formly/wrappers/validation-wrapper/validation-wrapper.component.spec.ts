import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';

import { ValidationIconsComponent } from 'ish-shared/formly/components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { ValidationWrapperComponent } from './validation-wrapper.component';

describe('Validation Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'example',
              component: FormlyTestingExampleComponent,
            },
          ],
          wrappers: [
            {
              name: 'validation',
              component: ValidationWrapperComponent,
            },
          ],
          extras: {
            showError: field =>
              field.formControl &&
              field.formControl.invalid &&
              (field.formControl.dirty ||
                (field.options.parentForm && field.options.parentForm.submitted) ||
                !!(field.field.validation && field.field.validation.show)),
          },
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [
        MockComponent(ValidationIconsComponent),
        MockComponent(ValidationMessageComponent),
        ValidationWrapperComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'example',
          type: 'example',
          wrappers: ['validation'],
          templateOptions: {
            required: true,
          },
        },
      ],
      model: {
        example: '',
      },
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
    expect(element.querySelector('ish-validation-wrapper')).toBeTruthy();
  });

  it('should display message if a showError condition is met', () => {
    fixture.detectChanges();
    component.form.get('example').markAsDirty();
    fixture.detectChanges();
    expect(element.querySelector('ish-validation-message')).toBeTruthy();
  });
});
