import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

import { LineItemQuantity } from 'ish-core/models/line-item-quantity/line-item-quantity.model';
import { User } from 'ish-core/models/user/user.model';
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
  updateItem = new EventEmitter<LineItemQuantity>();
  @Output()
  deleteItem = new EventEmitter<string>();
  @Output()
  copyQuote = new EventEmitter<void>();
  @Output()
  rejectQuote = new EventEmitter<void>();
  @Output()
  addQuoteToBasket = new EventEmitter<string>();

  form: FormGroup;

  sellerComment: string;
  validFromDate: number;
  validToDate: number;
  submitted = false;

  currentDateTime$ = interval(1000).pipe(
    startWith(0),
    mapTo(Date.now())
  );

  constructor() {
    this.form = new FormGroup({
      displayName: new FormControl(undefined, [Validators.required, Validators.maxLength(255)]),
      description: new FormControl(undefined, []),
    });
  }

  ngOnChanges() {
    const quote = this.quote as Quote;

    this.sellerComment = quote.sellerComment;
    this.validFromDate = quote.validFromDate;
    this.validToDate = quote.validToDate;

    this.patchForm(quote);
  }

  private patchForm(quote: Quote) {
    if (quote.displayName) {
      this.form.patchValue({ displayName: quote.displayName });
    }
    if (quote.description) {
      this.form.patchValue({ description: quote.description });
    }
  }

  /**
   * Throws updateItem event when onUpdateItem event trigggerd.
   * @param item Item id and quantity pair that should be changed
   */
  onUpdateItem(item: LineItemQuantity) {
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
