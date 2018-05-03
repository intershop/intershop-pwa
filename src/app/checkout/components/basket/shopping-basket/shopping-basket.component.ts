import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markAsDirtyRecursive } from '../../../../forms/shared/utils/form-utils';
import { SpecialValidators } from '../../../../forms/shared/validators/special-validators';
import { Basket } from '../../../../models/basket/basket.model';
import { ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketComponent implements OnChanges {
  @Input() basket: Basket;

  @Output() update = new EventEmitter<{ itemId: string; quantity: number }[]>();
  @Output() deleteItem = new EventEmitter<string>();

  form: FormGroup;
  submitted = false;
  generateProductRoute = ProductHelper.generateProductRoute;

  constructor(private fb: FormBuilder) {}

  /**
   * if the basket changes a new form is created for basket quantities update
   */
  ngOnChanges() {
    this.form = new FormGroup({
      items: new FormArray(this.createItemForm(this.basket)),
    });
  }

  /**
   * returns an array of formgroups (itemId and quantity) according to the given basket
   */
  createItemForm(basket: Basket): FormGroup[] {
    const itemsForm: FormGroup[] = [];

    for (const item of basket.lineItems) {
      itemsForm.push(
        this.fb.group({
          itemId: item.id,
          quantity: [
            item.quantity.value,
            [Validators.required, Validators.max(item.product.maxOrderQuantity), SpecialValidators.integer],
          ],
        })
      );
    }
    return itemsForm;
  }

  /**
   * Submits quantities form and throws updateQuantities event when form is valid
   */
  submitForm() {
    // handle invalid form: should actually never happen because button is disabled in this case
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    // convert quantity form values to number
    for (const item of this.form.value.items) {
      item.quantity = parseInt(item.quantity, 10);
    }

    this.update.emit(this.form.value.items);
  }

  /**
   * throws deleteItem event when delete button was clicked
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }
}
