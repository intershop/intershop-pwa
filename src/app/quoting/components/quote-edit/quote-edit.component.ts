import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Quote } from '../../../models/quote/quote.model';
import { QuoteRequest } from '../../../models/quoterequest/quoterequest.model';

/**
 * The Quote Edit Component displays and updates quote or quote request data.
 * It provides modify and delete functionality for quote request items.
 * It provides functionality to submit a quote request.
 * It allows to create a new quote request, based on an existing quote.
 * It provides functionality to reject or add quote items to basket for a accepted quote.
 *
 * @example
 * <ish-quote-edit
 *   [quote]="quoteRequest"
 *   (deleteItem)="deleteQuoteRequestItem($event)"
 *   (updateItems)="updateQuoteRequestItems($event)"
 *   (updateQuoteRequest)="updateQuoteRequest($event)"
 *   (submitQuoteRequest)="submitQuoteRequest()"
 *   (copyQuote)="copyQuote()"
 * >
 * </ish-quote-edit>
 */
@Component({
  selector: 'ish-quote-edit',
  templateUrl: './quote-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditComponent implements OnChanges {
  @Input() quote: Quote | QuoteRequest;

  @Output() updateQuoteRequest = new EventEmitter<{ displayName: string; description?: string }>();
  @Output() submitQuoteRequest = new EventEmitter<void>();
  @Output() updateItems = new EventEmitter<{ itemId: string; quantity: number }[]>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() copyQuote = new EventEmitter<void>();

  form: FormGroup;

  description: string;
  sellerComment: string;
  validFromDate: number;
  validToDate: number;

  /**
   * Indicates if quote request is editable.
   */
  // TODO: dynamic implementation
  get editMode(): boolean {
    return true;
  }

  /**
   * Indicates if display name is editable.
   */
  get editDisplayName(): boolean {
    if (this.quote && (this.quote.state === 0 || (this.quote.state === 4 && this.editMode === true))) {
      return true;
    }
    return false;
  }

  /**
   * Indicates if description is editable.
   */
  get editDescription(): boolean {
    if (this.quote && (this.quote.state === 0 || (this.quote.state === 4 && this.editMode === true))) {
      return true;
    }
    return false;
  }

  constructor() {
    this.form = new FormGroup({
      displayName: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      description: new FormControl(null, []),
    });
  }

  ngOnChanges() {
    this.description = undefined;
    this.sellerComment = undefined;
    this.validFromDate = undefined;
    this.validToDate = undefined;

    const quote = this.quote as Quote;

    // TODO: remove
    quote.state = 0;

    if (quote.displayName) {
      this.form.patchValue({ displayName: quote.displayName });
    }

    if (quote.description) {
      this.form.patchValue({ description: quote.description });
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
   * Update Form Group with line items from child component
   * @param lineItemForm The child components form group.
   */
  onFormChange(lineItemForm: FormGroup) {
    this.form.setControl('inner', lineItemForm);
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   */
  onDeleteItem(itemId) {
    this.deleteItem.emit(itemId);
  }

  /**
   * Throws submitQuoteRequest event when submit button was clicked.
   */
  submit() {
    this.submitQuoteRequest.emit();
  }

  /**
   * Throws updateQuoteRequest and updateItems event if update button was clicked.
   */
  update() {
    if (!this.form || !this.form.value.inner) {
      return;
    }

    // convert quantity form values to number
    const items = this.form.value.inner.items.map(item => {
      return {
        ...item,
        quantity: parseInt(item.quantity, 10),
      };
    });

    this.updateItems.emit(items);
    this.updateQuoteRequest.emit({
      displayName: this.form.value.displayName,
      description: this.form.value.description,
    });
  }

  /**
   * Throws copyQuote event if copy button was clicked.
   */
  copy() {
    this.copyQuote.emit();
  }
}
