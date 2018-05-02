import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-mobile-basket',
  templateUrl: './mobile-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBasketComponent {
  @Input() cartItems: { salePrice: { value: number } }[];
}
