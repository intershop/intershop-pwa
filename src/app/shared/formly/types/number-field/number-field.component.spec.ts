// filepath: src/app/shared/formly/types/number-field/test_number-field.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { NumberFieldComponent } from './number-field.component';

describe('Number Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-number-field',
              component: NumberFieldComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [NumberFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'numberField',
          type: 'ish-number-field',
          props: {
            min: 1,
            max: 10,
            step: 1,
            inputClass: 'custom-class',
            ariaLabel: 'Number Input',
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
    expect(element.querySelector('ish-number-field')).toBeTruthy();

    expect(element.querySelector('.counter-input')).toBeTruthy();
    expect(element.querySelector('.decrease-button')).toBeTruthy();
    expect(element.querySelector('.increase-button')).toBeTruthy();
    expect(element.querySelector('input[type="number"]')).toBeTruthy();
  });
});
