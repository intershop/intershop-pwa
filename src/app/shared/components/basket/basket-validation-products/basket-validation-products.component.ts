import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

/**
 * Displays the products that are not valid any more after basket validation and that has been removed from basket
 *
 * @example
 * <ish-basket-validation-products [items]="removedItems" />
 */
@Component({
  selector: 'ish-basket-validation-products',
  imports: [
    PricePipe,
    ProductContextDirective,
    ProductIdComponent,
    ProductImageComponent,
    ProductInventoryComponent,
    ProductNameComponent,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './basket-validation-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketValidationProductsComponent {
  @Input({ required: true }) items: { message: string; productSKU: string; price: PriceItem }[];
}
