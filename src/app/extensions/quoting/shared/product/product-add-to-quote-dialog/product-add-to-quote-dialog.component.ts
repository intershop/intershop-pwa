import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, take, takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';

@Component({
  selector: 'ish-product-add-to-quote-dialog',
  templateUrl: './product-add-to-quote-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogComponent implements OnInit, OnDestroy {
  activeQuoteRequest$: Observable<QuoteRequest>;
  quoteRequestLoading$: Observable<boolean>;

  form: FormGroup;

  private destroy$ = new Subject();

  constructor(public ngbActiveModal: NgbActiveModal, private quotingFacade: QuotingFacade) {
    this.form = new FormGroup({
      displayName: new FormControl(undefined, [Validators.maxLength(255)]),
      description: new FormControl(undefined, []),
    });
  }

  ngOnInit() {
    this.activeQuoteRequest$ = this.quotingFacade.activeQuoteRequest$;
    this.quoteRequestLoading$ = this.quotingFacade.quoteRequestLoading$;

    this.activeQuoteRequest$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(quote => {
        this.patchForm(quote);
      });

    this.activeQuoteRequest$
      .pipe(
        filter(quoteRequest => !!quoteRequest),
        distinctUntilKeyChanged('id'),
        takeUntil(this.destroy$)
      )
      .subscribe(quoteRequest => this.quotingFacade.selectQuoteRequest(quoteRequest.id));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private patchForm(quote: QuoteRequest) {
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
    this.activeQuoteRequest$
      .pipe(
        take(1),
        whenTruthy()
      )
      .subscribe(quote => {
        if (quote.items.length === 1 && item.quantity === 0) {
          this.quotingFacade.deleteQuoteRequest(quote.id);
          this.hide();
        } else {
          this.quotingFacade.updateQuoteRequestItem(item);
        }
      });
  }

  /**
   * Throws deleteItem event when delete button was clicked.
   * Throws deleteQuoteRequest event when last item will be deleted.
   */
  onDeleteItem(itemId: string) {
    this.activeQuoteRequest$
      .pipe(
        take(1),
        whenTruthy()
      )
      .subscribe(quote => {
        if (quote.items.length === 1) {
          this.quotingFacade.deleteQuoteRequest(quote.id);
          this.hide();
        } else {
          this.quotingFacade.deleteQuoteRequestItem(itemId);
        }
      });
  }

  /**
   * Throws submitQuoteRequest event when submit button was clicked.
   */
  submit() {
    if (this.form && this.form.dirty) {
      this.quotingFacade.updateSubmitQuoteRequest({
        displayName: this.form.value.displayName,
        description: this.form.value.description,
      });
    } else {
      this.quotingFacade.submitQuoteRequest();
    }
    this.hide();
  }

  /**
   * Throws updateQuoteRequest and updateItems event if update button was clicked.
   */
  update() {
    if (!this.form) {
      return;
    }

    this.quotingFacade.updateQuoteRequest({
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
