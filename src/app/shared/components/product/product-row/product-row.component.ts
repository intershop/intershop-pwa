import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ImageLoading } from 'ish-core/models/image/image.model';
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

import { ProductAddToCompareComponent } from '../../../../extensions/compare/shared/product-add-to-compare/product-add-to-compare.component';
import { ProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductAddToQuoteComponent } from '../../../../extensions/quoting/shared/product-add-to-quote/product-add-to-quote.component';
import { ProductRatingComponent } from '../../../../extensions/rating/shared/product-rating/product-rating.component';
import { ProductAddToWishlistComponent } from '../../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    FeatureToggleDirective,
    ProductAddToBasketComponent,
    ProductAddToCompareComponent,
    ProductAddToOrderTemplateComponent,
    ProductAddToQuoteComponent,
    ProductAddToWishlistComponent,
    ProductChooseVariationComponent,
    ProductIdComponent,
    ProductImageComponent,
    ProductInventoryComponent,
    ProductItemVariationsComponent,
    ProductLabelComponent,
    ProductNameComponent,
    ProductPriceComponent,
    ProductPromotionComponent,
    ProductQuantityComponent,
    ProductRatingComponent,
    ProductShipmentComponent,
    ServerHtmlDirective,
    TranslatePipe,
  ],
})
export class ProductRowComponent implements OnInit {
  @Input() loading: ImageLoading;
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
