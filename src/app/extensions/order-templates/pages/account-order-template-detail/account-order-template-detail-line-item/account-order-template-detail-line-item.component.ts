import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail-line-item',
  templateUrl: './account-order-template-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailLineItemComponent implements OnInit {
  constructor(private context: ProductContextFacade, private orderTemplatesFacade: OrderTemplatesFacade) {}

  @Input() orderTemplateItemData: OrderTemplateItem;
  @Input() currentOrderTemplate: OrderTemplate;

  ngOnInit() {
    this.context.hold(this.context.validDebouncedQuantityUpdate$(), quantity => {
      this.updateProductQuantity(this.context.get('sku'), quantity);
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

  updateProductQuantity(sku: string, quantity: number) {
    this.orderTemplatesFacade.addProductToOrderTemplate(
      this.currentOrderTemplate.id,
      sku,
      quantity - this.orderTemplateItemData.desiredQuantity.value
    );
  }

  removeProductFromOrderTemplate(sku: string) {
    this.orderTemplatesFacade.removeProductFromOrderTemplate(this.currentOrderTemplate.id, sku);
  }

  setActive(target: EventTarget) {
    this.context.set('propagateActive', () => (target as HTMLInputElement).checked);
  }
}
