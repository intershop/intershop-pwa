import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CompareExportsModule } from 'src/app/extensions/compare/exports/compare-exports.module';
import { OrderTemplatesExportsModule } from 'src/app/extensions/order-templates/exports/order-templates-exports.module';
import { ProductNotificationsExportsModule } from 'src/app/extensions/product-notifications/exports/product-notifications-exports.module';
import { QuotingExportsModule } from 'src/app/extensions/quoting/exports/quoting-exports.module';
import { RatingExportsModule } from 'src/app/extensions/rating/exports/rating-exports.module';
import { WishlistsExportsModule } from 'src/app/extensions/wishlists/exports/wishlists-exports.module';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductChooseVariationComponent } from 'ish-shared/components/product/product-choose-variation/product-choose-variation.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductItemVariationsComponent } from 'ish-shared/components/product/product-item-variations/product-item-variations.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductImageComponent,
    ProductLabelComponent,
    ProductNameComponent,
    ProductIdComponent,
    NgIf,
    AsyncPipe,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductItemVariationsComponent,
    ProductPromotionComponent,
    TranslateModule,
    ProductQuantityComponent,
    ProductAddToBasketComponent,
    ProductChooseVariationComponent,
    RatingExportsModule,
    QuotingExportsModule,
    OrderTemplatesExportsModule,
    ProductNotificationsExportsModule,
    CompareExportsModule,
    WishlistsExportsModule,
    ServerHtmlDirective,
  ],
})
export class ProductRowComponent implements OnInit {
  product$: Observable<ProductView>;
  quantity$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.quantity$ = this.context.select('quantity');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
