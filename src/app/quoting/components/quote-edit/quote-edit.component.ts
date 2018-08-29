import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';
import { User } from '../../../models/user/user.model';

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
 *   [user]="user"
 *   (deleteItem)="deleteQuoteRequestItem($event)"
 *   (updateItem)="updateQuoteRequestItem($event)"
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
  @Input()
  quote: Quote | QuoteRequest;
  @Input()
  user: User;

  @Output()
  updateQuoteRequest = new EventEmitter<{ displayName: string; description?: string }>();
  @Output()
  submitQuoteRequest = new EventEmitter<void>();
  @Output()
  updateItem = new EventEmitter<{ itemId: string; quantity: number }>();
  @Output()
  deleteItem = new EventEmitter<string>();
  @Output()
  copyQuote = new EventEmitter<void>();
  @Output()
  rejectQuote = new EventEmitter<void>();
  @Output()
  addQuoteToBasket = new EventEmitter<string>();

  form: FormGroup;

  description: string;
  sellerComment: string;
  validFromDate: number;
  validToDate: number;
  submitted = false;

  constructor() {
    this.form = new FormGroup({
      displayName: new FormControl(undefined, [Validators.required, Validators.maxLength(255)]),
      description: new FormControl(undefined, []),
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
   * Throws updateItem event when onUpdateItem event trigggerd.
   * @param item Item id and quantity pair that should be changed
   */
  onUpdateItem(item: { itemId: string; quantity: number }) {
    this.updateItem.emit(item);
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
   * Throws updateQuoteRequest event if update button was clicked.
   */
  update() {
    if (!this.form) {
      return;
    }

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
