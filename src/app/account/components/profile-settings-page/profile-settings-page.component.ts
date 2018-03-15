import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  selector: 'ish-profile-settings-page',
  templateUrl: './profile-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageComponent {

  showSuccessMessage: string;
  @Input() customer: Customer;
}
