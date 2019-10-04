import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounce, filter, takeUntil } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { getLoggedInUser } from 'ish-core/store/user';

import {
  CreateQuoteRequestFromQuoteRequest,
  DeleteItemFromQuoteRequest,
  DeleteQuoteRequest,
  SubmitQuoteRequest,
  UpdateQuoteRequest,
  UpdateQuoteRequestItems,
  getQuoteRequestError,
  getQuoteRequestLoading,
  getSelectedQuoteRequest,
} from '../../store/quote-request';

@Component({
  selector: 'ish-quote-request-edit-page-container',
  templateUrl: './quote-request-edit-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestEditPageContainerComponent implements OnInit, OnDestroy {
  quote$ = this.store.pipe(select(getSelectedQuoteRequest));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  quoteError$ = this.store.pipe(select(getQuoteRequestError));
  user$ = this.store.pipe(select(getLoggedInUser));

  submitted = false;

  private destroy$ = new Subject();

  constructor(private store: Store<{}>, private router: Router) {}

  ngOnInit() {
    // reset quote request page if the user routes directly to the quote request after quote request submission
    this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd && !event.snapshot.queryParamMap.has('submitted')),
        debounce(() => this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.submitted = false;
      });
  }

  updateQuoteRequestItem(payload: LineItemUpdate) {
    this.store.dispatch(new UpdateQuoteRequestItems({ lineItemUpdates: [payload] }));
  }

  deleteQuoteRequestItem(payload: string) {
    this.store.dispatch(new DeleteItemFromQuoteRequest({ itemId: payload }));
  }

  deleteQuoteRequest(payload: string) {
    this.store.dispatch(new DeleteQuoteRequest({ id: payload }));
  }

  updateQuoteRequest(payload: { displayName?: string; description?: string }) {
    this.store.dispatch(new UpdateQuoteRequest(payload));
  }

  submitQuoteRequest() {
    this.store.dispatch(new SubmitQuoteRequest());
    this.router.navigate([], { queryParams: { submitted: true } });
    this.submitted = true;
  }

  copyQuote() {
    this.store.dispatch(new CreateQuoteRequestFromQuoteRequest());
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
