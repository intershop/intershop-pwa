import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { markAsDirtyRecursive } from '../../../../forms/shared/utils/form-utils';
import { SpecialValidators } from '../../../../forms/shared/validators/special-validators';
import { BasketView } from '../../../../models/basket/basket.model';
import { ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketComponent implements OnChanges {
  @Input() basket: BasketView;

  @Output() updateItems = new EventEmitter<{ itemId: string; quantity: number }[]>();
  @Output() deleteItem = new EventEmitter<string>();

  form: FormGroup;
  submitted = false;
  generateProductRoute = ProductHelper.generateProductRoute;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  /**
   * If the basket changes a new form is created for basket quantities update.
   */
  ngOnChanges() {
    this.form = new FormGroup({
      items: new FormArray(this.createItemForm(this.basket)),
    });
  }

  /**
   * Returns an array of formgroups (itemId and quantity) according to the given basket.
   */
  createItemForm(basket: BasketView): FormGroup[] {
    const itemsForm: FormGroup[] = [];

    for (const item of basket.lineItems) {
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
    return itemsForm;
  }

  /**
   * Submits quantities form and throws updateItems event when form is valid.
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
    this.updateItems.emit(this.form.value.items);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }

  /**
   * checkout button leads to checkout address page
   */
  checkout() {
    // ToDo: routing should be handled in another way, see #ISREST-317
    this.router.navigate(['/checkout/address']);
  }
}
