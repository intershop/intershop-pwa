import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';

import { LineItemQuantity } from '../../../models/line-item-quantity/line-item-quantity.model';
import {
  DeleteItemFromQuoteRequest,
  SelectQuoteRequest,
  SubmitQuoteRequest,
  UpdateQuoteRequest,
  UpdateQuoteRequestItems,
  getActiveQuoteRequest,
  getQuoteRequestLoading,
} from '../../store/quote-request';

@Component({
  selector: 'ish-product-add-to-quote-dialog-container',
  templateUrl: './product-add-to-quote-dialog.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogContainerComponent implements OnInit, OnDestroy {
  activeQuoteRequest$ = this.store.pipe(select(getActiveQuoteRequest));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));

  destroy$ = new Subject();

  constructor(public ngbActiveModal: NgbActiveModal, private store: Store<{}>) {}

  ngOnInit() {
    this.activeQuoteRequest$
      .pipe(
        filter(quoteRequest => !!quoteRequest),
        distinctUntilKeyChanged('id'),
        takeUntil(this.destroy$)
      )
      .subscribe(quoteRequest => this.store.dispatch(new SelectQuoteRequest(quoteRequest.id)));
  }

  deleteQuoteRequestItem(payload: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId: payload }));
  }

  updateQuoteRequestItem(payload: LineItemQuantity) {
    this.store.dispatch(new UpdateQuoteRequestItems([payload]));
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(new UpdateQuoteRequest(payload));
  }

  submitQuoteRequest() {
    this.store.dispatch(new SubmitQuoteRequest());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
