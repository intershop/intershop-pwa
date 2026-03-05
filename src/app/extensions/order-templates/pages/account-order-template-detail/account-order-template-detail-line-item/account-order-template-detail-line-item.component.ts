import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../../models/order-template/order-template.model';
import { SelectOrderTemplateModalComponent } from '../../../shared/select-order-template-modal/select-order-template-modal.component';

@Component({
  selector: 'ish-account-order-template-detail-line-item',
  templateUrl: './account-order-template-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ProductBundleDisplayComponent,
    ProductIdComponent,
    ProductImageComponent,
    ProductInventoryComponent,
    ProductNameComponent,
    ProductPriceComponent,
    ProductQuantityComponent,
    ProductVariationDisplayComponent,
    ReactiveFormsModule,
    SelectOrderTemplateModalComponent,
    TranslatePipe,
  ],
})
export class AccountOrderTemplateDetailLineItemComponent implements OnInit {
  @Input() orderTemplateItemData: OrderTemplateItem;
  @Input() currentOrderTemplate: OrderTemplate;

  checkBox = new FormControl();

  constructor(private context: ProductContextFacade, private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.context.hold(this.context.validDebouncedQuantityUpdate$(), quantity => {
      this.updateProductQuantity(this.context.get('sku'), quantity);
    });

    this.context.connect('propagateActive', this.checkBox.valueChanges);

    this.context.hold(this.context.select('inventory').pipe(map(inventory => inventory?.inStock)), available => {
      this.checkBox.setValue(available);
      if (available) {
        this.checkBox.enable();
      } else {
        this.checkBox.disable();
      }
    });
  }

  moveItemToOtherOrderTemplate(sku: string, orderTemplateMoveData: { id: string; title: string }) {
    if (orderTemplateMoveData.id) {
      this.orderTemplatesFacade.moveItemToOrderTemplate(
        this.currentOrderTemplate.id,
        orderTemplateMoveData.id,
        sku,
        this.context.get('quantity')
      );
    } else {
      this.orderTemplatesFacade.moveItemToNewOrderTemplate(
        this.currentOrderTemplate.id,
        orderTemplateMoveData.title,
        sku,
        this.context.get('quantity')
      );
    }
  }

  private updateProductQuantity(sku: string, quantity: number) {
    this.orderTemplatesFacade.addProductToOrderTemplate(
      this.currentOrderTemplate.id,
      sku,
      quantity - this.orderTemplateItemData.desiredQuantity.value
    );
  }

  removeProductFromOrderTemplate(sku: string) {
    this.orderTemplatesFacade.removeProductFromOrderTemplate(this.currentOrderTemplate.id, sku);
  }
}
