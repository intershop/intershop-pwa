import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import { QuotingFacade } from '../../../../facades/quoting.facade';
import { QuoteRequest } from '../../../../models/quote-request/quote-request.model';

@Component({
  selector: 'ish-product-add-to-quote-dialog-container',
  templateUrl: './product-add-to-quote-dialog.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogContainerComponent implements OnInit, OnDestroy {
  activeQuoteRequest$: Observable<QuoteRequest>;
  quoteRequestLoading$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(public ngbActiveModal: NgbActiveModal, private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.quotingFacade.activeQuoteRequest$;
    this.quoteRequestLoading$ = this.quotingFacade.quoteRequestLoading$;

    this.activeQuoteRequest$
      .pipe(
        filter(quoteRequest => !!quoteRequest),
        distinctUntilKeyChanged('id'),
        takeUntil(this.destroy$)
      )
      .subscribe(quoteRequest => this.quotingFacade.selectQuoteRequest(quoteRequest.id));
  }

  deleteQuoteRequestItem(itemId: string) {
    this.quotingFacade.deleteQuoteRequestItem(itemId);
  }

  deleteQuoteRequest(id: string) {
    this.quotingFacade.deleteQuoteRequest(id);
  }

  updateQuoteRequestItem(payload: LineItemUpdate) {
    this.quotingFacade.updateQuoteRequestItem(payload);
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.quotingFacade.updateQuoteRequest(payload);
  }

  submitQuoteRequest() {
    this.quotingFacade.submitQuoteRequest();
  }

  updateSubmitQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.quotingFacade.updateSubmitQuoteRequest(payload);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
