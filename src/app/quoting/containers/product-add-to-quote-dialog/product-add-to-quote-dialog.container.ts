import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';

import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
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
  activeQuoteRequest$: Observable<QuoteRequest>;
  quoteRequestLoading$: Observable<boolean>;

  destroy$ = new Subject();

  constructor(public ngbActiveModal: NgbActiveModal, private store: Store<{}>) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.store.pipe(select(getActiveQuoteRequest));
    this.quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));

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

  updateQuoteRequestItem(payload: { itemId: string; quantity: number }) {
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
