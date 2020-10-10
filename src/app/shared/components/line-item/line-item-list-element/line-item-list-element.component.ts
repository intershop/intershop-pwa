import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { AnyProductViewType, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-line-item-list-element',
  templateUrl: './line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemListElementComponent implements OnInit {
  @Input() pli: Partial<LineItemView & OrderLineItem>;
  @Input() editable = true;
  @Input() lineItemViewType?: 'simple' | 'availability';

  product$: Observable<AnyProductViewType>;

  isBundleProduct = ProductHelper.isProductBundle;

  constructor(private context: ProductContextFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');

    this.context.hold(this.context.validDebouncedQuantityUpdate$(), quantity => {
      this.checkoutFacade.updateBasketItem({ itemId: this.pli.id, quantity });
    });
  }

  onUpdateItem(update: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(update);
  }

  onDeleteItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
  }
}
