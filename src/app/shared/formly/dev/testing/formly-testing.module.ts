import { CommonModule } from '@angular/common';
import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FORMLY_CONFIG, FieldType, FieldWrapper, FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

/* eslint-disable ish-custom-rules/project-structure */
/* eslint-disable ish-custom-rules/require-formly-code-documentation */

@Component({ template: 'CaptchaFieldComponent: {{ field.key }} {{ to | json }}' })
class CaptchaFieldComponent extends FieldType {}

@Component({ template: 'CheckboxFieldComponent: {{ field.key }} {{ to | json }}' })
class CheckboxFieldComponent extends FieldType {}

@Component({
  template: `FieldsetFieldComponent:
    <div *ngFor="let f of field.fieldGroup">
      {{ getFieldSummary(f) }}
      {{ f.templateOptions | json }}
    </div>`,
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
  template: `RadioFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }} `,
})
class RadioFieldComponent extends FieldType {}

@Component({ template: 'TextInputFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class TextInputFieldComponent extends FieldType {}

@Component({ template: 'PlainTextFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class PlainTextFieldComponent extends FieldType {}

@Component({ template: 'HtmlTextFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class HtmlTextFieldComponent extends FieldType {}

@Component({ template: 'EmailFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class EmailFieldComponent extends FieldType {}

@Component({ template: 'PhoneFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class PhoneFieldComponent extends FieldType {}

@Component({ template: 'PasswordFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class PasswordFieldComponent extends FieldType {}

@Component({ template: 'SelectFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class SelectFieldComponent extends FieldType {}

@Component({ template: 'TextareaFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class TextareaFieldComponent extends FieldType {}

@Component({ template: 'DummyLibraryFieldComponent: {{ field.key }}' })
class DummyLibraryFieldComponent extends FieldType {}

@Component({ template: `<ng-template #fieldComponent> </ng-template>` })
class DummyWrapperComponent extends FieldWrapper {}

@Component({ template: 'DatePickerFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class DatePickerFieldComponent extends FieldType {}

@NgModule({
  declarations: [
    CaptchaFieldComponent,
    CheckboxFieldComponent,
    DatePickerFieldComponent,
    DummyWrapperComponent,
    EmailFieldComponent,
    FieldsetFieldComponent,
    HtmlTextFieldComponent,
    PasswordFieldComponent,
    PhoneFieldComponent,
    PlainTextFieldComponent,
    RadioFieldComponent,
    SelectFieldComponent,
    TextareaFieldComponent,
    TextInputFieldComponent,
  ],
  imports: [
    CommonModule,
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
          name: 'ish-phone-field',
          component: PhoneFieldComponent,
        },
        {
          name: 'ish-select-field',
          component: SelectFieldComponent,
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
        },
        { name: 'ish-radio-field', component: RadioFieldComponent },
        { name: 'ish-captcha-field', component: CaptchaFieldComponent },
        { name: 'ish-date-picker-field', component: DatePickerFieldComponent },
      ],
      wrappers: [
        { name: 'form-field-horizontal', component: DummyWrapperComponent },
        { name: 'form-field-checkbox-horizontal', component: DummyWrapperComponent },
        { name: 'textarea-description', component: DummyWrapperComponent },
        { name: 'tooltip', component: DummyWrapperComponent },
        { name: 'validation', component: DummyWrapperComponent },
        { name: 'description', component: DummyWrapperComponent },
        { name: 'form-field-radio-horizontal', component: DummyWrapperComponent },
      ],
    }),
    FormlySelectModule,
    ReactiveFormsModule,
  ],
  exports: [FormlyForm, ReactiveFormsModule],
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
