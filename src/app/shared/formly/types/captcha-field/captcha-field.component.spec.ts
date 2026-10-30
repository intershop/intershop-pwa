import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { CaptchaFieldComponent } from './captcha-field.component';

describe('Captcha Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;
  let form: FormGroup;
  let captchaField: FormlyFieldConfig;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-captcha-field',
              component: CaptchaFieldComponent,
              defaultOptions: { key: 'captcha' },
            },
          ],
        }),
        FormlyTestingComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    form = new FormGroup({});
    captchaField = {
      type: 'ish-captcha-field',
      props: {
        topic: 'test',
        required: true,
      },
    };
    const testComponentInputs = {
      fields: [captchaField],
      form,
      model: {},
    };
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-captcha-field > ish-lazy-captcha')).toBeTruthy();
  });

  it('should register the field form control as captcha form control and add the captchaAction form control', () => {
    expect(captchaField.formControl).toBe(form.get('captcha'));
    expect(form.get('captchaAction').value).toEqual('test');
  });

  it('should validate the captcha form control according to the field configuration', () => {
    expect(captchaField.formControl.hasError('required')).toBeTrue();

    form.get('captcha').setValue('captchaResponseToken');
    expect(captchaField.formControl.valid).toBeTrue();

    form.get('captcha').setValue(undefined);
    expect(captchaField.formControl.hasError('required')).toBeTrue();
  });
});
