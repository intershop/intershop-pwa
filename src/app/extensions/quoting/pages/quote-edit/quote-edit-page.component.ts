import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote } from '../../models/quote/quote.model';

@Component({
  selector: 'ish-quote-edit-page',
  templateUrl: './quote-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageComponent implements OnInit {
  quote$: Observable<Quote>;
  quoteLoading$: Observable<boolean>;
  quoteError$: Observable<HttpError>;
  user$: Observable<User>;

  constructor(private quotingFacade: QuotingFacade, private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.quote$ = this.quotingFacade.quote$;
    this.quoteLoading$ = this.quotingFacade.quoteLoading$;
    this.quoteError$ = this.quotingFacade.quoteError$;
    this.user$ = this.accountFacade.user$;
  }

  copyQuote() {
    this.quotingFacade.createQuoteRequestFromQuote();
  }

  rejectQuote() {
    this.quotingFacade.rejectQuote();
  }

  addQuoteToBasket(quoteId: string) {
    this.quotingFacade.addQuoteToBasket(quoteId);
    this.router.navigate(['/basket']);
  }
}
