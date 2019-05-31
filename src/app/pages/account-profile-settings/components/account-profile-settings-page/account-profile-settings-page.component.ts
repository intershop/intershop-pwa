import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-account-profile-settings-page',
  templateUrl: './account-profile-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileSettingsPageComponent {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() successMessage: string;
}
