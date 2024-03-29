import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Overview Page Component displays the account overview dashboard of the user's 'MyAccount' section.
 *
 * @example
 * <ish-account-overview [user]="user$ | async"></ish-account-overview>
 */
@Component({
  selector: 'ish-account-overview',
  templateUrl: './account-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent {
  @Input({ required: true }) user: User;
  @Input() customer: Customer;
}
