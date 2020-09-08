import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-product-add-to-quote-dialog',
  templateUrl: './product-add-to-quote-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogComponent implements OnInit {
  activeQuoteRequest$: Observable<QuoteRequest>;
  loading$: Observable<boolean>;
  state$: Observable<QuoteStatus>;
  error$: Observable<HttpError>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.quotingFacade.activeQuoteRequest$;
    this.loading$ = this.quotingFacade.loading$;
    this.state$ = this.quotingFacade.activeQuoteRequestState$;
    this.error$ = this.quotingFacade.error$;
  }

  hide() {
    console.log('TODO', 'hide dialog');
  }
}
