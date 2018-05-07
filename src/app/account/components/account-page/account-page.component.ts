import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PrivateCustomer } from '../../../models/customer/private-customer.model';
import { SmbCustomerUser } from '../../../models/customer/smb-customer-user.model';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  @Input() user: PrivateCustomer | SmbCustomerUser;
}
