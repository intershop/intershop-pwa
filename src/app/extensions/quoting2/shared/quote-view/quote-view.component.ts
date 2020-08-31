import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { Quote, QuoteRequest } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-view',
  templateUrl: './quote-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteViewComponent implements OnInit {
  @Input() quote: Quote | QuoteRequest;

  userEmail$: Observable<string>;

  state = QuotingHelper.state;
  asQuote = QuotingHelper.asQuote;

  constructor(private accountFacade: AccountFacade, private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.userEmail$ = this.accountFacade.userEmail$;
  }

  get isQuoteStarted(): boolean {
    return Date.now() > this.asQuote(this.quote)?.validFromDate;
  }

  get isQuoteValid(): boolean {
    return Date.now() < this.asQuote(this.quote)?.validToDate && Date.now() > this.asQuote(this.quote)?.validFromDate;
  }

  reject() {
    this.quotingFacade.reject(this.asQuote(this.quote));
  }

  copy() {
    this.quotingFacade.copy(this.quote);
  }

  addToBasket() {
    this.quotingFacade.addToBasket(this.asQuote(this.quote));
  }
}
