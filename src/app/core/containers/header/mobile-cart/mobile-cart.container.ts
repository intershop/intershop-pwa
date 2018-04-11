import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'ish-mobile-cart-container',
  templateUrl: './mobile-cart.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileCartContainerComponent {
  cartItems$ = of([]);
}
