import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

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
  @Input() items: { message: string; productSKU: string }[];

  constructor(private shoppingFacade: ShoppingFacade) {}

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }
}
