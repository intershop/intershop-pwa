import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { InfoMessageComponent } from 'ish-shared/components/common/info-message/info-message.component';

import { QuoteContextFacade, isQuoteStarted } from '../../facades/quote-context.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';
import { QuoteLineItemListComponent } from '../quote-line-item-list/quote-line-item-list.component';
import { QuoteStateComponent } from '../quote-state/quote-state.component';

@Component({
  selector: 'ish-quote-view',
  templateUrl: './quote-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    InfoMessageComponent,
    DatePipe,
    QuoteLineItemListComponent,
    QuoteStateComponent,
    RouterLink,
    TranslatePipe,
    ServerHtmlDirective],
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
