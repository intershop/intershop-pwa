import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
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
export class LineItemListComponent implements OnChanges, OnDestroy {
  @Input() lineItems: LineItemView[];
  @Input() editable = true;
  @Input() total: Price;
  @Input() lineItemViewType?: 'simple';

  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();

  form: FormGroup;
  formLength = 0;

  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder) {
    this.form = new FormGroup({});
  }

  /**
   * If the basket changes a new form is created for basket quantities update.
   */
  ngOnChanges() {
    if (this.lineItems.length > 0 && this.lineItems[0].product) {
      this.form = new FormGroup({
        items: new FormArray(this.createItemForm(this.lineItems)),
      });
    }
  }

  /**
   * Returns an array of formgroups (itemId and quantity) according to the given line items.
   * @param lineItems An array of line items.
   * @returns         An array of formgroups.
   */
  createItemForm(lineItems: LineItemView[]): FormGroup[] {
    const itemsForm: FormGroup[] = [];
    this.destroy$.next();

    for (const lineItem of lineItems) {
      if (lineItem.product) {
        const formGroup = this.formBuilder.group({
          itemId: lineItem.id,
          unit: lineItem.product.packingUnit,
          quantity: [
            lineItem.quantity.value,
            [Validators.required, Validators.max(lineItem.product.maxOrderQuantity), SpecialValidators.integer],
          ],
        });

        // Subscribe on form value changes
        formGroup.valueChanges
          .pipe(
            debounceTime(800),
            takeUntil(this.destroy$)
          )
          .subscribe(item => {
            if (formGroup.valid) {
              // TODO: figure out why quantity is returned as string by the valueChanges instead of number (the '+item.quantity' fixes that for now) - see ISREST-755
              this.onUpdateItem({ ...item, quantity: +item.quantity });
            }
          });

        itemsForm.push(formGroup);
        this.formLength = itemsForm.length;
      }
    }

    return itemsForm;
  }

  /**
   * Throws updateItem event when item quantity was changed.
   * @param item ItemId and quantity pair that should be updated
   */
  onUpdateItem(item: LineItemUpdate) {
    this.updateItem.emit(item);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   * @param itemId The id of the item that should be deleted.
   */
  onDeleteItem(itemId: string) {
    this.deleteItem.emit(itemId);
  }

  /**
   * Unsubscribe observabled on view destroy.
   */
  ngOnDestroy() {
    this.destroy$.next();
  }

  trackByFn(_, item: LineItemView) {
    return item.productSKU;
  }
}
