import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldWrapper, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

// tslint:disable: project-structure

@Component({ template: 'CaptchaFieldComponent: {{ field.key }} {{ to | json }}' })
class CaptchaFieldComponent extends FieldType {}

@Component({ template: 'CheckboxFieldComponent: {{ field.key }} {{ to | json }}' })
class CheckboxFieldComponent extends FieldType {}

@Component({
  template: `FieldsetFieldComponent:
    <div *ngFor="let f of field.fieldGroup">
      {{ f.key }}
      {{ f.type }}
      {{ f.templateOptions | json }}
    </div>`,
})
class FieldsetFieldComponent extends FieldType {}

@Component({ template: 'TextInputFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class TextInputFieldComponent extends FieldType {}

@Component({ template: 'EmailFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class EmailFieldComponent extends FieldType {}

@Component({ template: 'PasswordFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class PasswordFieldComponent extends FieldType {}

@Component({ template: 'SelectFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class SelectFieldComponent extends FieldType {}

@Component({ template: 'TextareaFieldComponent: {{ field.key }} {{ field.type }} {{ to | json }}' })
class TextareaFieldComponent extends FieldType {}

@Component({ template: `<ng-template #fieldComponent> </ng-template>` })
class DummyWrapperComponent extends FieldWrapper {}

// tslint:enable: project-structure

@NgModule({
  declarations: [
    CaptchaFieldComponent,
    CheckboxFieldComponent,
    DummyWrapperComponent,
    EmailFieldComponent,
    FieldsetFieldComponent,
    PasswordFieldComponent,
    SelectFieldComponent,
    TextInputFieldComponent,
    TextareaFieldComponent,
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
          name: 'ish-fieldset-field',
          component: FieldsetFieldComponent,
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
          name: 'ish-select-field',
          component: SelectFieldComponent,
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
        },
        { name: 'ish-captcha-field', component: CaptchaFieldComponent },
      ],
      wrappers: [
        { name: 'form-field-horizontal', component: DummyWrapperComponent },
        { name: 'form-field-checkbox-horizontal', component: DummyWrapperComponent },
        { name: 'textarea-description', component: DummyWrapperComponent },
        { name: 'tooltip', component: DummyWrapperComponent },
        { name: 'validation', component: DummyWrapperComponent },
        { name: 'description', component: DummyWrapperComponent },
      ],
    }),
    FormlySelectModule,
    ReactiveFormsModule,
  ],
  exports: [FormlyForm, ReactiveFormsModule],
})
// tslint:disable-next-line: project-structure
export class FormlyTestingModule {}
