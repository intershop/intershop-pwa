// tslint:disable:ccp-no-markup-in-containers
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LoadQuotes, getCurrentQuotes, getQuoteLoading } from '../../../../store/quote';
import { LoadQuoteRequests, getCurrentQuoteRequests, getQuoteRequestLoading } from '../../../../store/quote-request';

@Component({
  selector: 'ish-quote-widget-container',
  templateUrl: './quote-widget.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteWidgetContainerComponent implements OnInit {
  quoteRequests$ = this.store.pipe(select(getCurrentQuoteRequests));
  quotes$ = this.store.pipe(select(getCurrentQuotes));

  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  quoteLoading$ = this.store.pipe(select(getQuoteLoading));

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadQuoteRequests());
    this.store.dispatch(new LoadQuotes());
  }
}
