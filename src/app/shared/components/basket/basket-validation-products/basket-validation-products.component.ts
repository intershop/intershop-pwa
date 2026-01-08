import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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
 * <ish-basket-validation-products [items]="removedItems"></ish-basket-validation-products>
 */
@Component({
  selector: 'ish-basket-validation-products',
  templateUrl: './basket-validation-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ProductContextDirective,
    ProductImageComponent,
    ProductIdComponent,
    ProductNameComponent,
    ProductInventoryComponent,
    PricePipe,
    TranslateModule,
  ],
})
export class BasketValidationProductsComponent {
  @Input({ required: true }) items: { message: string; productSKU: string; price: PriceItem }[];
}
