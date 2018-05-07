import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PrivateCustomer } from '../../../../models/customer/private-customer.model';
import { SmbCustomerUser } from '../../../../models/customer/smb-customer-user.model';

@Component({
  selector: 'ish-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent {
  @Input() user: PrivateCustomer | SmbCustomerUser;
}
