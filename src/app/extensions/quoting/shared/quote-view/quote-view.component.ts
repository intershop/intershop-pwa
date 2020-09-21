import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { QuoteContextFacade, isQuoteStarted } from '../../facades/quote-context.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-view',
  templateUrl: './quote-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteViewComponent implements OnInit {
  quote$: Observable<Quote | QuoteRequest>;
  state$: Observable<QuoteStatus>;
  userEmail$: Observable<string>;

  isQuoteStarted$: Observable<boolean>;
  justSubmitted$: Observable<boolean>;

  asQuote = QuotingHelper.asQuote;
  asQuoteRequest = QuotingHelper.asQuoteRequest;

  constructor(private accountFacade: AccountFacade, private context: QuoteContextFacade) {}

  ngOnInit() {
    this.quote$ = this.context.select('entity');
    this.state$ = this.context.select('state');
    this.userEmail$ = this.accountFacade.userEmail$;
    this.isQuoteStarted$ = this.context.select(isQuoteStarted);
    this.justSubmitted$ = this.context.select('justSubmitted');
  }
}
