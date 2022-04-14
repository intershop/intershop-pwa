import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

/**
 * Type that will render an <ish-formly-address-form> component
 * and configure it to use the current form as its parent.
 *
 * @templateOption **businessCustomer** will be passed on to the component (see component documentation for infos).
 */
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
