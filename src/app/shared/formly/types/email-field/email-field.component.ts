import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-email-field',
  templateUrl: './email-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailFieldComponent extends FieldType {
  formControl: FormControl;
  prePopulate(field: FormlyFieldConfig) {
    field.validators = field.validators ?? {};
    field.validators.validation = [...(field.validators.validation ?? []), Validators.email];

    field.validation = field.validation ?? {};
    field.validation.messages = {
      ...field.validation?.messages,
      email: 'helpdesk.contactus.email.error',
    };
  }
}
