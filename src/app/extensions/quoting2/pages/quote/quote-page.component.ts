import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-page',
  templateUrl: './quote-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotePageComponent implements OnInit {
  selectedQuote$: Observable<Quote | QuoteRequest>;
  loading$: Observable<boolean>;
  state$: Observable<QuoteStatus>;
  error$: Observable<HttpError>;

  asQuoteRequest = QuotingHelper.asQuoteRequest;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.selectedQuote$ = this.quotingFacade.selected$;
    this.loading$ = this.quotingFacade.loading$;
    this.state$ = this.quotingFacade.selectedState$;
    this.error$ = this.quotingFacade.error$;
  }
}
