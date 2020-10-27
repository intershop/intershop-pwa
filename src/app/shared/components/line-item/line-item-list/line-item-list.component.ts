import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { memoize } from 'lodash-es';
import { debounceTime } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { Price } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Line Item List Component displays a line items.
 * It provides optional delete and edit functionality
 * It provides optional lineItemView (string 'simple')
 * It provides optional total cost output
 *
 * @example
 * <ish-line-item-list
 *   [lineItems]="lineItems"
 *   [editable]="editable"
 *   [total]="total"
 *   lineItemViewType="simple"  // simple = no edit-button, inventory, shipment
 *   (updateItem)="onUpdateItem($event)"
 *   (deleteItem)="onDeleteItem($event)"
 * ></ish-line-item-list>
 */
@Component({
  selector: 'ish-line-item-list',
  templateUrl: './line-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemListComponent {
  @Input() lineItems: Partial<LineItemView & OrderLineItem>[];
  @Input() editable = true;
  @Input() total: Price;
  @Input() lineItemViewType?: 'simple' | 'availability';

  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();

  constructor(private shoppingFacade: ShoppingFacade) {}

  createDummyForm: (pli: Partial<LineItemView>, maxOrderQuantity?: number) => FormGroup = memoize(
    (pli, maxOrderQuantity) => {
      const group = new FormGroup({
        quantity: new FormControl(pli.quantity.value, [
          Validators.required,
          Validators.max(maxOrderQuantity),
          SpecialValidators.integer,
        ]),
      });
      group
        .get('quantity')
        .valueChanges.pipe(debounceTime(800))
        // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
        .subscribe(item => {
          if (group.valid) {
            // TODO: figure out why quantity is returned as string by the valueChanges instead of number (the '+item' fixes that for now) - see ISREST-755
            this.onUpdateItem({
              quantity: +item,
              itemId: pli.id,
            });
          }
        });

      return group;
    },
    pli => pli.id + pli.quantity?.value
  );

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }

  /**
   * Throws updateItem event when item quantity was changed.
   * @param item ItemId and quantity pair that should be updated
   */
  onUpdateItem(item: LineItemUpdate) {
    (this.createDummyForm({ id: item.itemId, quantity: { value: item.quantity } }).get(
      'quantity'
    ) as FormControl).setValue(item.quantity, {
      emitEvent: false,
    });
    this.updateItem.emit(item);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   * @param itemId The id of the item that should be deleted.
   */
  onDeleteItem(itemId: string) {
    this.deleteItem.emit(itemId);
  }

  trackByFn(_, item: LineItemView) {
    return item.productSKU;
  }
}
