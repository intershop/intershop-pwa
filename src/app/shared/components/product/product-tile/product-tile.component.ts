import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ProductAddToCompareComponent } from 'src/app/extensions/compare/shared/product-add-to-compare/product-add-to-compare.component';
import { ProductAddToOrderTemplateComponent } from 'src/app/extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductAddToQuoteComponent } from 'src/app/extensions/quoting/shared/product-add-to-quote/product-add-to-quote.component';
import { ProductRatingComponent } from 'src/app/extensions/rating/shared/product-rating/product-rating.component';
import { ProductAddToWishlistComponent } from 'src/app/extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ImageLoading } from 'ish-core/models/image/image.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductItemVariationsComponent } from 'ish-shared/components/product/product-item-variations/product-item-variations.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductImageComponent,
    ProductLabelComponent,
    ProductPriceComponent,
    ProductItemVariationsComponent,
    ProductNameComponent,
    ProductPromotionComponent,
    NgIf,
    AsyncPipe,
    TranslatePipe,
    ProductAddToCompareComponent,
    ProductAddToOrderTemplateComponent,
    ProductAddToQuoteComponent,
    ProductAddToWishlistComponent,
    ProductRatingComponent,
    ProductAddToBasketComponent,
    FeatureToggleDirective,
  ],
})
export class ProductTileComponent implements OnInit {
  @Input() loading: ImageLoading;
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
