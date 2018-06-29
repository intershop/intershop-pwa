import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-checkout-receipt',
  templateUrl: './checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptComponent {
  @Input() basket: Basket;
}
