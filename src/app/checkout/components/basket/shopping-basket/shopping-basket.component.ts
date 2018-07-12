import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { markAsDirtyRecursive } from '../../../../forms/shared/utils/form-utils';
import { BasketView } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketComponent {
  @Input() basket: BasketView;

  @Output() updateItems = new EventEmitter<{ itemId: string; quantity: number }[]>();
  @Output() deleteItem = new EventEmitter<string>();

  form: FormGroup;
  submitted = false;

  constructor(private router: Router) {
    this.form = new FormGroup({});
  }

  /**
   * Submits quantities form and throws updateItems event when form is valid.
   */
  submitForm() {
    if (!this.form || !this.form.value.inner) {
      return;
    }

    // handle invalid form: should actually never happen because button is disabled in this case
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    // convert quantity form values to number
    const items = this.form.value.inner.items.map(item => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
    }));

    this.updateItems.emit(items);
  }

  /**
   * Create new Form Group which contains line items from child component
   * @param lineItemForm The child components form group.
   */
  onFormChange(lineItemForm: FormGroup) {
    this.form = new FormGroup({
      inner: lineItemForm,
    });
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
