import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Quote } from '../../../models/quote/quote.model';

// TODO: documentation
@Component({
  selector: 'ish-quote-edit',
  templateUrl: './quote-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditComponent {
  @Input() quote: Quote;

  @Output() updateItems = new EventEmitter<{ quoteRequestId: string; items: { itemId: string; quantity: number }[] }>();
  @Output() deleteItem = new EventEmitter<{ quoteRequestId: string; itemId: string }>();

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({});
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
    this.deleteItem.emit({ quoteRequestId: this.quote.id, itemId });
  }
}
