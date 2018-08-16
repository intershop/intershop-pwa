import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
 *   [bsModalRef]="bsModalRef"
 *   [quote]="quoteRequest"
 *   [quoteLoading]="false"
 *   (deleteItem)="deleteQuoteRequestItem($event)"
 *   (updateItems)="updateQuoteRequestItems($event)"
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
  bsModalRef: BsModalRef;
  @Input()
  quote: QuoteRequest;
  @Input()
  quoteLoading = false;

  @Output()
  updateQuoteRequest = new EventEmitter<{ displayName: string; description?: string }>();
  @Output()
  submitQuoteRequest = new EventEmitter<void>();
  @Output()
  updateItems = new EventEmitter<{ itemId: string; quantity: number }[]>();
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
    this.hide();
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
    this.hide();
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.bsModalRef.hide();
  }
}
