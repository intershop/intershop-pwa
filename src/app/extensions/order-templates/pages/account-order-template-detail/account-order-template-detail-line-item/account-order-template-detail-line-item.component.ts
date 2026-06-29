import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail-line-item',
  templateUrl: './account-order-template-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailLineItemComponent implements OnInit {
  @Input() orderTemplateItemData: OrderTemplateItem;
  @Input() currentOrderTemplate: OrderTemplate;

  @Output() readonly moveClicked = new EventEmitter<string>();

  checkBox = new FormControl();

  constructor(
    private context: ProductContextFacade,
    private orderTemplatesFacade: OrderTemplatesFacade
  ) {}

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

  emitMoveClicked() {
    this.moveClicked.emit(this.orderTemplateItemData.id);
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
