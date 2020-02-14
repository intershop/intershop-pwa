import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

/**
 * Displays the products that are not valid any more after basket validation and that has been removed from basket
 *
 * @example
 * <ish-basket-validation-products [items]="removedItems"></ish-basket-validation-products>
 */
@Component({
  selector: 'ish-basket-validation-products',
  templateUrl: './basket-validation-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketValidationProductsComponent {
  @Input() items: { message: string; product: ProductView }[];
}
