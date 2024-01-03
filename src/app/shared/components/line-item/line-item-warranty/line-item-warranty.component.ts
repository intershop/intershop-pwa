import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Line Item Warranty Component displays the selected warranty. If the parameter editable is true a select box is shown and the user can selects a warranty. Otherwise only the warranty name is displayed.
 *
 * @example
 * <ish-line-item-warranty
 *    [pli]=pli
 *    [editable]="true' />
 */
@Component({
  selector: 'ish-line-item-warranty',
  templateUrl: './line-item-warranty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemWarrantyComponent implements OnInit {
  @Input({ required: true }) pli: Partial<LineItemView & OrderLineItem>;
  @Input() editable = false;

  constructor(private context: ProductContextFacade, private checkoutFacade: CheckoutFacade) {}

  productHasWarranties$: Observable<boolean>;

  ngOnInit() {
    this.productHasWarranties$ = this.context.select('product').pipe(
      whenTruthy(),
      map(product => !!product.availableWarranties?.length)
    );
  }

  updateLineItemWarranty(warrantySku: string) {
    this.checkoutFacade.updateBasketItemWarranty(this.pli.id, warrantySku);
  }
}
