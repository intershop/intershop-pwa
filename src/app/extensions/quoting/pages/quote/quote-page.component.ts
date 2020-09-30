import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { SelectedQuoteContextFacade } from '../../facades/selected-quote-context.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-page',
  templateUrl: './quote-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: QuoteContextFacade, useClass: SelectedQuoteContextFacade }],
})
export class QuotePageComponent implements OnInit {
  selectedQuote$: Observable<Quote | QuoteRequest>;
  loading$: Observable<boolean>;
  state$: Observable<QuoteStatus>;
  error$: Observable<HttpError>;
  justSubmitted$: Observable<boolean>;

  asQuoteRequest = QuotingHelper.asQuoteRequest;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.selectedQuote$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.state$ = this.context.select('state');
    this.error$ = this.context.select('error');
    this.justSubmitted$ = this.context.select('justSubmitted');
  }
}
