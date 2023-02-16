import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-line-item-list-element',
  templateUrl: './line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemListElementComponent implements OnInit {
  @Input({ required: true }) pli: Partial<LineItemView & OrderLineItem>;
  @Input() editable = true;
  @Input() lineItemViewType: 'simple' | 'availability';

  productHasWarranties$: Observable<boolean>;

  constructor(private context: ProductContextFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.context.hold(this.context.validDebouncedQuantityUpdate$(), quantity => {
      this.checkoutFacade.updateBasketItem({ itemId: this.pli.id, quantity });
    });

    this.productHasWarranties$ = this.context.select('product').pipe(
      whenTruthy(),
      map(product => !!product.availableWarranties?.length)
    );
  }

  get oldPrice() {
    return isEqual(this.pli.singleBasePrice, this.pli.undiscountedSingleBasePrice)
      ? undefined
      : this.pli.undiscountedSingleBasePrice;
  }

  get selectedWarrantyInfo$() {
    return this.context.select('product').pipe(
      whenTruthy(),
      map(product => product.availableWarranties.find(warranty => warranty.id === this.pli.warranty.sku))
    );
  }

  onUpdateItem(update: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(update);
  }

  onDeleteItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
  }

  updateSelectedWarranty(warrantySku: string) {
    this.checkoutFacade.updateBasketItemWarranty(this.pli.id, warrantySku);
  }
}
