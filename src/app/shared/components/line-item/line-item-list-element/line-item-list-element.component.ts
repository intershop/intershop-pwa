import { DecimalPipe, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { Subscription } from 'rxjs';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { LineItemEditComponent } from 'ish-shared/components/line-item/line-item-edit/line-item-edit.component';
import { LineItemInformationEditComponent } from 'ish-shared/components/line-item/line-item-information-edit/line-item-information-edit.component';
import { LineItemWarrantyComponent } from 'ish-shared/components/line-item/line-item-warranty/line-item-warranty.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { ProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/shared/product-add-to-order-template/product-add-to-order-template.component';
import { ProductAddToWishlistComponent } from '../../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

@Component({
  selector: 'ish-line-item-list-element',
  templateUrl: './line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductNameComponent,
    ProductIdComponent,
    ProductImageComponent,
    ProductVariationDisplayComponent,
    ProductBundleDisplayComponent,
    ProductInventoryComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    PricePipe,
    ProductShipmentComponent,
    TranslatePipe,
    LineItemEditComponent,
    ProductContextDirective,
    NgClass,
    ServerSettingPipe,
    NgbPopoverModule,
    ProductAddToOrderTemplateComponent,
    ProductAddToWishlistComponent,
    FeatureToggleDirective,
    ProductQuantityComponent,
    ProductQuantityLabelComponent,
    DecimalPipe,
    BasketPromotionComponent,
    LineItemWarrantyComponent,
    LineItemInformationEditComponent,
  ],
})
export class LineItemListElementComponent implements OnChanges {
  @Input({ required: true }) pli: Partial<LineItemView & OrderLineItem>;
  @Input() editable = true;
  @Input() lineItemViewType: 'simple' | 'availability';

  private updateSubscription: Subscription;
  private destroyRef = inject(DestroyRef);

  constructor(
    private context: ProductContextFacade,
    private checkoutFacade: CheckoutFacade
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pli) {
      if (this.updateSubscription) {
        // eslint-disable-next-line ban/ban
        this.updateSubscription.unsubscribe();
      }

      this.updateSubscription = this.context
        .validDebouncedQuantityUpdate$()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(quantity => {
          this.checkoutFacade.updateBasketItem({ itemId: this.pli.id, quantity });
        });
    }
  }

  get oldPrice() {
    return isEqual(this.pli.singleBasePrice, this.pli.undiscountedSingleBasePrice)
      ? undefined
      : this.pli.undiscountedSingleBasePrice;
  }

  onUpdateItem(update: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(update);
  }

  onDeleteItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
  }
}
