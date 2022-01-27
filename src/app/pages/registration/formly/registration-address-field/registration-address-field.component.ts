import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-registration-address-field',
  templateUrl: './registration-address-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationAddressFieldComponent extends FieldType {
  get parent() {
    return this.form as FormGroup;
  }
}
