import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';

import { ValidationMessageComponent } from 'ish-shared/formly/components/validation-message/validation-message.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { CaptchaWrapperComponent } from './captcha-wrapper.component';

describe('Captcha Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-captcha-field',
              component: FormlyTestingExampleComponent,
            },
          ],
          wrappers: [
            {
              name: 'captcha',
              component: CaptchaWrapperComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [CaptchaWrapperComponent, MockComponent(ValidationMessageComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'captcha',
          type: 'ish-captcha-field',
          wrappers: ['captcha'],
        },
      ],
      model: {
        captcha: '',
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
    expect(element.querySelector('ish-captcha-wrapper')).toBeTruthy();
  });

  it('should display message if a showError condition is met', () => {
    fixture.detectChanges();
    component.form.get('captcha').setErrors({ required: true });
    component.options.parentForm = { submitted: true } as unknown;
    fixture.detectChanges();
    expect(element.querySelector('ish-validation-message')).toBeTruthy();
  });

  it('should not display message if a showError condition is not met', () => {
    fixture.detectChanges();
    component.options.parentForm = { submitted: true } as unknown;
    expect(element.querySelector('ish-validation-message')).toBeFalsy();
  });
});
