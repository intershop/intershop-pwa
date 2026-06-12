import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render a terms and conditions field, specific for the registration form.
 */
@Component({
  selector: 'ish-registration-tac-field',
  templateUrl: './registration-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationTacFieldComponent extends FieldType<FieldTypeConfig> {}
