import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { LineItemQuantity } from 'ish-core/models/line-item-quantity/line-item-quantity.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { SpecialValidators } from '../../../forms/validators/special-validators';

/**
 * The Line Item List Component displays a line items.
 * It prodives optional delete and edit functionality
 * It provides optional total cost output
 *
 * @example
 * <ish-line-item-list
 *   [lineItems]="lineItems"
 *   [editable]="editable"
 *   [total]="total"
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
  @Input()
  lineItems: LineItemView[];
  @Input()
  editable = true;
  @Input()
  total: Price;

  @Output()
  updateItem = new EventEmitter<LineItemQuantity>();
  @Output()
  deleteItem = new EventEmitter<string>();

  form: FormGroup;
  generateProductRoute = ProductHelper.generateProductRoute;

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
          quantity: [
            lineItem.quantity.value,
            [Validators.required, Validators.max(lineItem.product.maxOrderQuantity), SpecialValidators.integer],
          ],
        });

        // Subscribe on form value changes
        formGroup.valueChanges
          .pipe(
            debounceTime(500),
            takeUntil(this.destroy$)
          )
          .subscribe(item => {
            if (formGroup.valid) {
              this.onUpdateItem(item);
            }
          });

        itemsForm.push(formGroup);
      }
    }

    return itemsForm;
  }

  /**
   * Throws updateItem event when item quantity was changed.
   * @param item ItemId and quantity pair that should be updated
   */
  onUpdateItem(item: LineItemQuantity) {
    this.updateItem.emit(item);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   * @param itemId The id of the item that should be deleted.
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }

  /**
   * Unsubscribe observabled on view destroy.
   */
  ngOnDestroy() {
    this.destroy$.next();
  }
}
