import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'ish-mobile-basket-container',
  templateUrl: './mobile-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBasketContainerComponent {
  cartItems$ = of([]);
}
