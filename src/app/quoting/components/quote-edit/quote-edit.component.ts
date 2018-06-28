import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';

// TODO: documentation
@Component({
  selector: 'ish-quote-edit',
  templateUrl: './quote-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditComponent implements OnChanges {
  @Input() quote: Quote | QuoteRequest;

  @Output() updateItems = new EventEmitter<{ items: { itemId: string; quantity: number }[] }>();
  @Output() deleteItem = new EventEmitter<string>();

  form: FormGroup;

  description: string;
  sellerComment: string;
  validFromDate: number;
  validToDate: number;

  constructor() {
    this.form = new FormGroup({});
  }

  ngOnChanges() {
    this.description = undefined;
    this.sellerComment = undefined;
    this.validFromDate = undefined;
    this.validToDate = undefined;

    const quote = this.quote as Quote;

    if (quote.description) {
      this.description = quote.description;
    }

    if (quote.sellerComment) {
      this.sellerComment = quote.sellerComment;
    }

    if (quote.validFromDate) {
      this.validFromDate = quote.validFromDate;
    }

    if (quote.validToDate) {
      this.validToDate = quote.validToDate;
    }
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
}
