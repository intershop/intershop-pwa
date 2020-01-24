import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteRequest } from '../../models/quote-request/quote-request.model';
import { Quote } from '../../models/quote/quote.model';

@Component({
  selector: 'ish-quote-list-page',
  templateUrl: './quote-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageComponent implements OnInit {
  quoteLoading$: Observable<boolean>;
  quoteRequestLoading$: Observable<boolean>;
  quotes$: Observable<(Quote | QuoteRequest)[]>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.quotes$ = this.quotingFacade.quotesAndQuoteRequests$();
    this.quoteLoading$ = this.quotingFacade.quoteLoading$;
    this.quoteRequestLoading$ = this.quotingFacade.quoteRequestLoading$;
  }

  deleteItem(item: Quote | QuoteRequest) {
    this.quotingFacade.deleteQuoteOrRequest(item);
  }
}
