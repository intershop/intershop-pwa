import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-mobile-cart',
  templateUrl: './mobile-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileCartComponent {

  @Input() cartItems: { salePrice: { value: number } }[];
}
