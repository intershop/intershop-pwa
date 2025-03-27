import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { TextInputFieldComponent } from './text-input-field.component';

describe('Text Input Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextInputFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-text-input-field', component: TextInputFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        NgxMaskDirective,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'input',
          type: 'ish-text-input-field',
          props: {
            label: 'test label',
            required: true,
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        input: '',
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
    expect(element.querySelector('ish-text-input-field > input')).toBeTruthy();
  });
});
