import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Customer } from '../../../../models/customer/customer.model';

@Component({
  selector: 'ish-login-status',
  templateUrl: './login-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginStatusComponent {
  @Input() customer: Customer;
}
