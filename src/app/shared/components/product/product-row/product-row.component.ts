import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyProductAddToCompareComponent } from 'src/app/extensions/compare/exports/lazy-product-add-to-compare/lazy-product-add-to-compare.component';
import { LazyProductAddToOrderTemplateComponent } from 'src/app/extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { ProductNotificationsExportsModule } from 'src/app/extensions/product-notifications/exports/product-notifications-exports.module';
import { LazyProductAddToQuoteComponent } from 'src/app/extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyProductRatingComponent } from 'src/app/extensions/rating/exports/lazy-product-rating/lazy-product-rating.component';
import { LazyProductAddToWishlistComponent } from 'src/app/extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

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
    LazyProductRatingComponent,
    LazyProductAddToQuoteComponent,
    LazyProductAddToOrderTemplateComponent,
    ProductNotificationsExportsModule,
    LazyProductAddToCompareComponent,
    LazyProductAddToWishlistComponent,
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
