import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
/**
 * The Account Overview Page Component displays the account overview dashboard of the user's 'MyAccount' section. See also {@link OrderOverviewPageContainerComponent}
 *
 * @example
 * <ish-account-overview-page [user]="user$ | async"></ish-account-overview-page>
 */
@Component({
  selector: 'ish-account-overview-page',
  templateUrl: './account-overview-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewPageComponent {
  @Input() user: User;
  @Input() customer: Customer;
}
