import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { PlainTextFieldComponent } from './plain-text-field.component';

describe('Plain Text Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlainTextFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-plain-text-field',
              component: PlainTextFieldComponent,
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
          key: 'displayValue',
          type: 'ish-plain-text-field',
          templateOptions: {
            label: 'test label',
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        displayValue: 'testValue',
      },
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
    expect(element.querySelector('ish-plain-text-field > div.col-form-label')).toBeTruthy();
  });
});
