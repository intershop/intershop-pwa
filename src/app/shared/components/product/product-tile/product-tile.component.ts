import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ImageLoading } from 'ish-core/models/image/image.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductImageComponent } from '../product-image/product-image.component';
import { ProductLabelComponent } from '../product-label/product-label.component';
import { ProductPriceComponent } from '../product-price/product-price.component';
import { ProductItemVariationsComponent } from '../product-item-variations/product-item-variations.component';
import { ProductNameComponent } from '../product-name/product-name.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProductPromotionComponent } from '../product-promotion/product-promotion.component';
import { LazyProductAddToCompareComponent } from 'src/app/extensions/compare/exports/lazy-product-add-to-compare/lazy-product-add-to-compare.component';
import { ProductAddToBasketComponent } from '../product-add-to-basket/product-add-to-basket.component';
import { LazyProductAddToQuoteComponent } from 'src/app/extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyProductAddToOrderTemplateComponent } from 'src/app/extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToWishlistComponent } from 'src/app/extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { LazyProductRatingComponent } from 'src/app/extensions/rating/exports/lazy-product-rating/lazy-product-rating.component';

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
    TranslateModule,
    LazyProductAddToCompareComponent,
    LazyProductAddToQuoteComponent,
    LazyProductAddToOrderTemplateComponent,
    LazyProductAddToWishlistComponent,
    LazyProductRatingComponent,
    ProductAddToBasketComponent,
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
