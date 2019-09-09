import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import {
  DeleteItemFromQuoteRequest,
  DeleteQuoteRequest,
  SelectQuoteRequest,
  SubmitQuoteRequest,
  UpdateQuoteRequest,
  UpdateQuoteRequestItems,
  getActiveQuoteRequest,
  getQuoteRequestLoading,
} from '../../../../store/quote-request';

@Component({
  selector: 'ish-product-add-to-quote-dialog-container',
  templateUrl: './product-add-to-quote-dialog.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogContainerComponent implements OnInit, OnDestroy {
  activeQuoteRequest$ = this.store.pipe(select(getActiveQuoteRequest));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));

  private destroy$ = new Subject();

  constructor(public ngbActiveModal: NgbActiveModal, private store: Store<{}>) {}

  ngOnInit() {
    this.activeQuoteRequest$
      .pipe(
        filter(quoteRequest => !!quoteRequest),
        distinctUntilKeyChanged('id'),
        takeUntil(this.destroy$)
      )
      .subscribe(quoteRequest => this.store.dispatch(new SelectQuoteRequest({ id: quoteRequest.id })));
  }

  deleteQuoteRequestItem(payload: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId: payload }));
  }

  deleteQuoteRequest(payload: string) {
    this.store.dispatch(new DeleteQuoteRequest({ id: payload }));
  }

  updateQuoteRequestItem(payload: LineItemUpdate) {
    this.store.dispatch(new UpdateQuoteRequestItems({ lineItemUpdates: [payload] }));
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
