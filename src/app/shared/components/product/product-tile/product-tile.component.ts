import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CompareExportsModule } from 'src/app/extensions/compare/exports/compare-exports.module';
import { OrderTemplatesExportsModule } from 'src/app/extensions/order-templates/exports/order-templates-exports.module';
import { QuotingExportsModule } from 'src/app/extensions/quoting/exports/quoting-exports.module';
import { RatingExportsModule } from 'src/app/extensions/rating/exports/rating-exports.module';
import { WishlistsExportsModule } from 'src/app/extensions/wishlists/exports/wishlists-exports.module';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
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
    TranslateModule,
    CompareExportsModule,
    QuotingExportsModule,
    OrderTemplatesExportsModule,
    WishlistsExportsModule,
    RatingExportsModule,
    ProductAddToBasketComponent,
  ],
})
export class ProductTileComponent implements OnInit {
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
