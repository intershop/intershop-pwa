import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../../../facades/quoting.facade';
import { QuoteRequest } from '../../../../models/quote-request/quote-request.model';
import { Quote } from '../../../../models/quote/quote.model';

@Component({
  selector: 'ish-quote-widget-container',
  templateUrl: './quote-widget.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-markup-in-containers
export class QuoteWidgetContainerComponent implements OnInit {
  quotes$: Observable<Quote[]>;
  quoteLoading$: Observable<boolean>;

  quoteRequests$: Observable<QuoteRequest[]>;
  quoteRequestLoading$: Observable<boolean>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.quotes$ = this.quotingFacade.quotes$();
    this.quoteRequests$ = this.quotingFacade.quoteRequests$();
    this.quoteLoading$ = this.quotingFacade.quoteLoading$;
    this.quoteRequestLoading$ = this.quotingFacade.quoteRequestLoading$;
  }
}
