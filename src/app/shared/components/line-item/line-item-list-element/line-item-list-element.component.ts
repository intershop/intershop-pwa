import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isEqual } from 'lodash-es';
import { Subscription } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-line-item-list-element',
  standalone: false,
  templateUrl: './line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
