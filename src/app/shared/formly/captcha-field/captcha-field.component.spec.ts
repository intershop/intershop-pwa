import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { LazyCaptchaComponent } from '../../../../extensions/captcha/exports/lazy-captcha/lazy-captcha.component';

import { CaptchaFieldComponent } from './captcha-field.component';

describe('Captcha Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptchaFieldComponent, MockComponent(LazyCaptchaComponent)],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-captcha-field',
              component: CaptchaFieldComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          type: 'ish-captcha-field',
          templateOptions: {
            topic: 'test',
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
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
});
