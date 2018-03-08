import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'ish-mini-cart-container',
  templateUrl: './mini-cart.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartContainerComponent {

  cartItems$: Observable<{ salePrice: { value: number } }[]> = of([
    { salePrice: { value: 214.12 } },
    { salePrice: { value: 214.12 } },
  ]);
}
