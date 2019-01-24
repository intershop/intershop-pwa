import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-address-form-business',
  templateUrl: './address-form-business.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressFormBusinessComponent {
  @Input()
  addressForm: FormGroup;

  get isBusinessAddress(): boolean {
    return this.addressForm && this.addressForm.get('companyName1') ? true : false;
  }
}
