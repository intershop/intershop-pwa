import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialValidators } from '../../../forms/shared/validators/special-validators';
import { BasketItemView } from '../../../models/basket-item/basket-item.model';
import { ProductHelper } from '../../../models/product/product.model';

/**
 * The Line Item List Component displays a line items.
 * It prodived delete and edit functionality
 *
 * @example
 * <ish-line-item-list
 *   [lineItems]="lineItems"
 *   (formChange)="onFormChange($event)"
 *   (deleteItem)="onDeleteItem($event)"
 * ></ish-line-item-list>
 */
@Component({
  selector: 'ish-line-item-list',
  templateUrl: './line-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemListComponent implements OnChanges {
  @Input() lineItems: BasketItemView[];

  @Output() formChange = new EventEmitter<FormGroup>();
  @Output() deleteItem = new EventEmitter<string>();

  form: FormGroup;
  generateProductRoute = ProductHelper.generateProductRoute;

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
      this.formChange.emit(this.form);
    }
  }

  /**
   * Returns an array of formgroups (itemId and quantity) according to the given line items.
   * @param lineItems An array of line items.
   * @returns         An array of formgroups.
   */
  createItemForm(lineItems: BasketItemView[]): FormGroup[] {
    const itemsForm: FormGroup[] = [];

    for (const item of lineItems) {
      if (item.id && item.product) {
        itemsForm.push(
          this.formBuilder.group({
            itemId: item.id,
            quantity: [
              item.quantity.value,
              [Validators.required, Validators.max(item.product.maxOrderQuantity), SpecialValidators.integer],
            ],
          })
        );
      }
    }
    return itemsForm;
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }
}
