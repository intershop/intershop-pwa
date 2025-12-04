import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { SelectedQuoteContextFacade } from '../../facades/selected-quote-context.facade';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';
import { QuoteEditComponent } from '../../shared/quote-edit/quote-edit.component';
import { QuoteInteractionsComponent } from '../../shared/quote-interactions/quote-interactions.component';
import { QuoteViewComponent } from '../../shared/quote-view/quote-view.component';

@Component({
  selector: 'ish-quote-page',
  imports: [
    AsyncPipe,
    ErrorMessageComponent,
    LoadingComponent,
    QuoteEditComponent,
    QuoteInteractionsComponent,
    QuoteViewComponent,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
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

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.selectedQuote$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.state$ = this.context.select('state');
    this.error$ = this.context.select('error');
    this.justSubmitted$ = this.context.select('justSubmitted');
  }
}
