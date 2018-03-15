import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {

  @Input() customer: Customer;
}
