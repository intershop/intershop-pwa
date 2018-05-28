import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Address } from '../../../../models/address/address.model';
import { Basket } from '../../../../models/basket/basket.model';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  @Input() basket: Basket;
  @Input() user: User;
  @Input() addresses: Address[];
}
