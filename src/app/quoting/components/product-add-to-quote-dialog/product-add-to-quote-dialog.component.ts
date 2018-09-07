import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { QuoteRequest } from '../../../models/quote-request/quote-request.model';

/**
 * The Product Add To Quote Dialog Component displays and updates quote request data.
 * It provides modify and delete functionality for quote request items.
 * It provides functionality to submit a quote request.
 *
 * It uses the {@link LoadingComponent} to provide loading indication.
 *
 * @example
 * <ish-product-add-to-quote-dialog
 *   [ngbActiveModal]="ngbActiveModal"
 *   [quote]="quoteRequest"
 *   [quoteLoading]="false"
 *   (deleteItem)="deleteQuoteRequestItem($event)"
 *   (updateItem)="updateQuoteRequestItem($event)"
 *   (updateQuoteRequest)="updateQuoteRequest($event)"
 *   (submitQuoteRequest)="submitQuoteRequest()"
 * >
 * </ish-product-add-to-quote-dialog>
 */
@Component({
  selector: 'ish-product-add-to-quote-dialog',
  templateUrl: './product-add-to-quote-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogComponent implements OnChanges {
  @Input()
  ngbActiveModal: NgbActiveModal;
  @Input()
  quote: QuoteRequest;
  @Input()
  quoteLoading = false;

  @Output()
  updateQuoteRequest = new EventEmitter<{ displayName: string; description?: string }>();
  @Output()
  submitQuoteRequest = new EventEmitter<void>();
  @Output()
  updateItem = new EventEmitter<{ itemId: string; quantity: number }>();
  @Output()
  deleteItem = new EventEmitter<string>();

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      displayName: new FormControl(undefined, [Validators.required, Validators.maxLength(255)]),
      description: new FormControl(undefined, []),
    });
  }

  ngOnChanges() {
    const quote = this.quote;

    if (!quote) {
      return;
    }

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
    this.hide();
  }

  /**
   * Throws updateQuoteRequest and updateItems event if update button was clicked.
   */
  update() {
    if (!this.form) {
      return;
    }

    this.updateQuoteRequest.emit({
      displayName: this.form.value.displayName,
      description: this.form.value.description,
    });
    this.hide();
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.ngbActiveModal.close();
  }
}
