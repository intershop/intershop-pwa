import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, merge, of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
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
  @Input() quote: Quote | QuoteRequest;
  @Input() user: User;
  @Input() error: HttpError;
  @Input() submitted = false;

  @Output() updateQuoteRequest = new EventEmitter<{ displayName: string; description?: string }>();
  @Output() submitQuoteRequest = new EventEmitter<void>();
  @Output() updateSubmitQuoteRequest = new EventEmitter<{ displayName: string; description?: string }>();
  @Output() updateItem = new EventEmitter<LineItemUpdate>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() deleteQuoteRequest = new EventEmitter<string>();
  @Output() copyQuote = new EventEmitter<void>();
  @Output() rejectQuote = new EventEmitter<void>();
  @Output() addQuoteToBasket = new EventEmitter<string>();

  form: FormGroup;

  sellerComment: string;
  validFromDate: number;
  validToDate: number;
  saved = false;
  displaySavedMessage$: Observable<boolean>;

  constructor(private router: Router) {
    this.form = new FormGroup({
      displayName: new FormControl(undefined, [Validators.maxLength(255)]),
      description: new FormControl(undefined, []),
    });
  }

  ngOnChanges(c: SimpleChanges) {
    const quote = this.quote as Quote;

    this.sellerComment = quote.sellerComment;
    this.validFromDate = quote.validFromDate;
    this.validToDate = quote.validToDate;

    if (c.quote) {
      this.patchForm(quote);
    }

    this.toggleSaveMessage();
  }

  private toggleSaveMessage() {
    if (!this.submitted && this.saved && !this.error && this.quote.state === 'New') {
      this.displaySavedMessage$ = merge(of(true), timer(5000).pipe(mapTo(false)));
    }
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
   * Throws deleteQuoteRequest event when last items quantity is changed to '0'.
   * @param item Item id and quantity pair that should be changed
   */
  onUpdateItem(item: LineItemUpdate) {
    if (this.quote.items.length === 1 && item.quantity === 0) {
      this.deleteQuoteRequest.emit(this.quote.id);
      this.router.navigate(['/account/quote-list']);
    } else {
      this.updateItem.emit(item);
    }
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   * Throws deleteQuoteRequest event when last item will be deleted.
   */
  onDeleteItem(itemId: string) {
    if (this.quote.items.length === 1) {
      this.deleteQuoteRequest.emit(this.quote.id);
      this.router.navigate(['/account/quote-list']);
    } else {
      this.deleteItem.emit(itemId);
    }
  }

  /**
   * Throws submitQuoteRequest event or if neccessary updateSubmitQuoteRequest event
   * when submit button was clicked.
   */
  submit() {
    if (this.form && this.form.dirty) {
      this.updateSubmitQuoteRequest.emit({
        displayName: this.form.value.displayName,
        description: this.form.value.description,
      });
    } else {
      this.submitQuoteRequest.emit();
    }
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
    this.saved = true;
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

  get isQuoteValid(): boolean {
    return Date.now() < this.validToDate && Date.now() > this.validFromDate;
  }

  get isQuoteStarted(): boolean {
    return Date.now() > this.validFromDate;
  }

  /**
   * returns a value to be displayed as quote name
   * @return display name of the quote if exists, quote number otherwise
   */
  get displayName(): string {
    return this.quote.displayName ? this.quote.displayName : this.quote.number;
  }
}
