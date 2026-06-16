import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { formlyTestingImports } from 'ish-shared/formly/dev/testing/formly-testing.imports';

import { CaptchaFieldComponent } from './captcha-field.component';

@Component({
  selector: 'ish-captcha',
  standalone: true,
  template: '',
})
class MockLazyCaptchaComponent {
  @Input() form: FormGroup;
  @Input() topic: string;
}

describe('Captcha Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ...formlyTestingImports,
        CaptchaFieldComponent,
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-captcha-field',
              component: CaptchaFieldComponent,
            },
          ],
        }),
      ],
    })
      .overrideComponent(CaptchaFieldComponent, {
        set: {
          template: `<ish-captcha [topic]="props.topic" [form]="form" [attr.data-testing-id]="field.key" />`,
          imports: [MockLazyCaptchaComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          type: 'ish-captcha-field',
          props: {
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
    expect(element.querySelector('ish-captcha-field ish-captcha')).toBeTruthy();
  });
});
