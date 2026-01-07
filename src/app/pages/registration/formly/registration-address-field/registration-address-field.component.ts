import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

import { FormlyAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-form/formly-address-form.component';

/**
 * Type that will render an <ish-formly-address-form> component
 * and configure it to use the current form as its parent.
 *
 * @props **businessCustomer** will be passed on to the component (see component documentation for infos).
 */
@Component({
  selector: 'ish-registration-address-field',
  templateUrl: './registration-address-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormlyAddressFormComponent],
})
export class RegistrationAddressFieldComponent extends FieldType {
  get parent() {
    return this.form as FormGroup;
  }
}
