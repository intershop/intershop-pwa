import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';

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
 *   (rejectQuote)="rejectQuote()"
 *   (addQuoteToBasket)="addQuoteToBasket($event)"
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
  @Output() rejectQuote = new EventEmitter<void>();
  @Output() addQuoteToBasket = new EventEmitter<string>();

  form: FormGroup;

  description: string;
  sellerComment: string;
  validFromDate: number;
  validToDate: number;
  submitted = false;

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
    this.submitted = true;
  }

  /**
   * Throws updateQuoteRequest and updateItems event if update button was clicked.
   */
  update() {
    if (!this.form || !this.form.value.inner) {
      return;
    }

    // convert quantity form values to number
    const items = this.form.value.inner.items.map(item => ({
      ...item,
      quantity: parseInt(item.quantity, 10),
    }));

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

  /**
   * Throws rejectQuote event if reject button was clicked.
   */
  reject() {
    this.rejectQuote.emit();
  }

  /**
   * Throws addQuoteToBasket event if addToBasket button was clicked.
   */
  addToBasket() {
    this.addQuoteToBasket.emit(this.quote.id);
  }
}
