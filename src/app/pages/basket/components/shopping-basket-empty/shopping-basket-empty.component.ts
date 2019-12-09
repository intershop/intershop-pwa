import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-shopping-basket-empty',
  templateUrl: './shopping-basket-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketEmptyComponent {
  @Input() error: HttpError;
}
