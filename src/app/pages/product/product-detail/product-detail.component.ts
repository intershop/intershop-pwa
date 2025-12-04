import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { PaymentPaypalMessagesComponent } from 'ish-shared/components/checkout/payment-paypal-messages/payment-paypal-messages.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductWarrantyComponent } from 'ish-shared/components/product/product-warranty/product-warranty.component';

import { OrderTemplatesExportsModule } from '../../../extensions/order-templates/exports/order-templates-exports.module';
import { ProductNotificationsExportsModule } from '../../../extensions/product-notifications/exports/product-notifications-exports.module';
import { QuotingExportsModule } from '../../../extensions/quoting/exports/quoting-exports.module';
import { RatingExportsModule } from '../../../extensions/rating/exports/rating-exports.module';
import { ProductBrandComponent } from '../product-brand/product-brand.component';
import { ProductDetailActionsComponent } from '../product-detail-actions/product-detail-actions.component';
import { ProductDetailVariationsComponent } from '../product-detail-variations/product-detail-variations.component';
import { ProductImagesComponent } from '../product-images/product-images.component';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductDetailActionsComponent,
    NgIf,
    ProductImagesComponent,
    RatingExportsModule,
    ProductBrandComponent,
    ProductDetailVariationsComponent,
    OrderTemplatesExportsModule,
    QuotingExportsModule,
    ProductNotificationsExportsModule,
    AsyncPipe,
    ProductNameComponent,
    ProductIdComponent,
    ProductPromotionComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductPriceComponent,
    ProductAddToBasketComponent,
    ProductQuantityComponent,
    ProductQuantityLabelComponent,
    ProductWarrantyComponent,
    PaymentPaypalMessagesComponent,
    ServerSettingPipe,
  ],
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  setSelectedWarranty(selectedWarranty: string) {
    this.context.setSelectedWarranty(selectedWarranty);
  }
}
