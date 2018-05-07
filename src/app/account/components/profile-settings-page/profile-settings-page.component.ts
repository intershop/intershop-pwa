import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PrivateCustomer } from '../../../models/customer/private-customer.model';

@Component({
  selector: 'ish-profile-settings-page',
  templateUrl: './profile-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPageComponent {
  showSuccessMessage: string;
  @Input() user: PrivateCustomer;
}
