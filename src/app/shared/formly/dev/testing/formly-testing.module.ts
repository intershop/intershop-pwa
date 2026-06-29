import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FORMLY_CONFIG,
  FieldArrayType,
  FieldType,
  FieldWrapper,
  FormlyField,
  FormlyFieldConfig,
  FormlyForm,
  FormlyModule,
} from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

/* eslint-disable ish-custom-rules/project-structure */
/* eslint-disable ish-custom-rules/require-formly-code-documentation */

@Component({
  selector: 'ish-captcha-test-field',
  imports: [JsonPipe],
  template: 'CaptchaFieldComponent: {{ field.key }} {{ to | json }}',
})
class CaptchaFieldComponent extends FieldType {}

@Component({
  selector: 'ish-checkbox-test-field',
  imports: [JsonPipe],
  template: 'CheckboxFieldComponent: {{ field.key }} {{ to | json }}',
})
class CheckboxFieldComponent extends FieldType {}

@Component({
  selector: 'ish-fieldset-test-field',
  imports: [JsonPipe],
  template: `FieldsetFieldComponent:
    @for (f of field.fieldGroup; track f) {
      <div>
        {{ getFieldSummary(f) }}
        {{ f.props | json }}
      </div>
    }`,
})
class FieldsetFieldComponent extends FieldType {
  getFieldSummary(f: FormlyFieldConfig): string {
    if (!f.fieldGroup) {
      return `${f.key} ${f.type}`;
    }
    return `${f.key} ${f.type} fieldGroup: [
      ${f.fieldGroup.map(f2 => this.getFieldSummary(f2))}
    ]`;
  }
}

@Component({
  selector: 'ish-radio-test-field',
  imports: [JsonPipe],
  template: `RadioFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }} `,
})
class RadioFieldComponent extends FieldType {}

@Component({
  selector: 'ish-radio-group-test-field',
  imports: [JsonPipe],
  template: 'RadioGroupFieldComponent: {{ field.key }} {{ to | json }}',
})
class RadioGroupFieldComponent extends FieldType {}

@Component({
  selector: 'ish-input-test-field',
  imports: [JsonPipe],
  template: 'TextInputFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class TextInputFieldComponent extends FieldType {}

@Component({
  selector: 'ish-plain-text-test-field',
  imports: [JsonPipe],
  template: 'PlainTextFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class PlainTextFieldComponent extends FieldType {}

@Component({
  selector: 'ish-html-test-field',
  imports: [JsonPipe],
  template: 'HtmlTextFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class HtmlTextFieldComponent extends FieldType {}

@Component({
  selector: 'ish-email-test-field',
  imports: [JsonPipe],
  template: 'EmailFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class EmailFieldComponent extends FieldType {}

@Component({
  selector: 'ish-phone-test-field',
  imports: [JsonPipe],
  template: 'PhoneFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class PhoneFieldComponent extends FieldType {}

@Component({
  selector: 'ish-password-test-field',
  imports: [JsonPipe],
  template: 'PasswordFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class PasswordFieldComponent extends FieldType {}

@Component({
  selector: 'ish-select-test-field',
  imports: [JsonPipe],
  template: 'SelectFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class SelectFieldComponent extends FieldType {}

@Component({
  selector: 'ish-search-select-test-field',
  imports: [JsonPipe],
  template: 'SearchSelectFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class SearchSelectFieldComponent extends FieldType {}

@Component({
  selector: 'ish-textarea-test-field',
  imports: [JsonPipe],
  template: 'TextareaFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class TextareaFieldComponent extends FieldType {}

@Component({
  selector: 'ish-library-test-field',
  template: 'DummyLibraryFieldComponent: {{ field.key }}',
})
class DummyLibraryFieldComponent extends FieldType {}

@Component({
  selector: 'ish-default-field-test-field',
  template: `<ng-template #fieldComponent />`,
})
class DummyWrapperComponent extends FieldWrapper {}

@Component({
  selector: 'ish-date-picker-test-field',
  imports: [JsonPipe],
  template: 'DatePickerFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class DatePickerFieldComponent extends FieldType {}

@Component({
  selector: 'ish-date-range-picker-test-field',
  imports: [JsonPipe],
  template: 'DateRangePickerFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class DateRangePickerFieldComponent extends FieldType {}

@Component({
  selector: 'ish-repeat-test-field',
  imports: [JsonPipe],
  template: 'RepeatFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class RepeatFieldComponent extends FieldArrayType {}

@Component({
  selector: 'ish-number-test-field',
  imports: [JsonPipe],
  template: 'NumberFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}',
})
class NumberFieldComponent extends FieldType {}

@NgModule({
  imports: [
    CaptchaFieldComponent,
    CheckboxFieldComponent,
    DatePickerFieldComponent,
    DateRangePickerFieldComponent,
    DummyLibraryFieldComponent,
    DummyWrapperComponent,
    EmailFieldComponent,
    FieldsetFieldComponent,
    HtmlTextFieldComponent,
    NumberFieldComponent,
    PasswordFieldComponent,
    PhoneFieldComponent,
    PlainTextFieldComponent,
    RadioFieldComponent,
    RadioGroupFieldComponent,
    RepeatFieldComponent,
    SearchSelectFieldComponent,
    SelectFieldComponent,
    TextareaFieldComponent,
    TextInputFieldComponent,
    CommonModule,
    FormlyField,
    FormlyForm,
    FormlyModule.forRoot({
      types: [
        {
          name: 'ish-text-input-field',
          component: TextInputFieldComponent,
        },
        {
          name: 'ish-plain-text-field',
          component: PlainTextFieldComponent,
        },
        {
          name: 'ish-html-text-field',
          component: HtmlTextFieldComponent,
        },
        {
          name: 'ish-fieldset-field',
          component: FieldsetFieldComponent,
        },
        {
          name: 'ish-radio-field',
          component: RadioFieldComponent,
        },
        { name: 'ish-radio-group-field', component: RadioGroupFieldComponent },
        {
          name: 'ish-checkbox-field',
          component: CheckboxFieldComponent,
        },
        {
          name: 'ish-email-field',
          component: EmailFieldComponent,
        },
        {
          name: 'ish-password-field',
          component: PasswordFieldComponent,
        },
        {
          name: 'ish-password-novalidate-field',
          component: PasswordFieldComponent,
        },
        {
          name: 'ish-phone-field',
          component: PhoneFieldComponent,
        },
        {
          name: 'ish-select-field',
          component: SelectFieldComponent,
        },
        {
          name: 'ish-search-select-field',
          component: SearchSelectFieldComponent,
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
        },
        { name: 'ish-captcha-field', component: CaptchaFieldComponent },
        { name: 'ish-date-picker-field', component: DatePickerFieldComponent },
        { name: 'ish-date-range-picker-field', component: DateRangePickerFieldComponent },
        { name: 'repeat', component: RepeatFieldComponent },
        {
          name: 'ish-number-field',
          component: NumberFieldComponent,
        },
      ],
      wrappers: [
        { name: 'form-field-horizontal', component: DummyWrapperComponent },
        { name: 'form-field-checkbox-horizontal', component: DummyWrapperComponent },
        { name: 'maxlength-description', component: DummyWrapperComponent },
        { name: 'tooltip', component: DummyWrapperComponent },
        { name: 'validation', component: DummyWrapperComponent },
        { name: 'description', component: DummyWrapperComponent },
        { name: 'form-field-radio-horizontal', component: DummyWrapperComponent },
      ],
    }),
    FormlySelectModule,
    ReactiveFormsModule,
  ],
  exports: [FormlyField, FormlyForm, ReactiveFormsModule],
})
export class FormlyTestingModule {
  static withPresetMocks(libraryMockTypes: string[] = []): ModuleWithProviders<FormlyTestingModule> {
    return {
      ngModule: FormlyTestingModule,
      providers: [
        {
          provide: FORMLY_CONFIG,
          multi: true,
          useValue: {
            types: [
              libraryMockTypes
                .map(libraryMockType => (libraryMockType.startsWith('#') ? libraryMockType : `#${libraryMockType}`))
                .map(name => ({
                  name,
                  component: DummyLibraryFieldComponent,
                  defaultOptions: { key: name.substring(1) },
                })),
            ],
          },
        },
      ],
    };
  }
}
