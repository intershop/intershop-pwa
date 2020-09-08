import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ActiveQuoteContextFacade } from '../../facades/active-quote-context.facade';
import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-product-add-to-quote-dialog',
  templateUrl: './product-add-to-quote-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: QuoteContextFacade, useClass: ActiveQuoteContextFacade }],
})
export class ProductAddToQuoteDialogComponent implements OnInit {
  activeQuoteRequest$: Observable<Quote | QuoteRequest>;
  loading$: Observable<boolean>;
  state$: Observable<QuoteStatus>;
  error$: Observable<HttpError>;
  editable$: Observable<boolean>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.context.entity$;
    this.loading$ = this.context.loading$;
    this.state$ = this.context.state$;
    this.error$ = this.context.error$;
    this.editable$ = this.context.isQuoteRequestEditable$;
  }

  hide() {
    console.log('TODO', 'hide dialog');
  }
}
