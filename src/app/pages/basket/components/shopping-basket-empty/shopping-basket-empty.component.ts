import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-shopping-basket-empty',
  templateUrl: './shopping-basket-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketEmptyComponent {}
