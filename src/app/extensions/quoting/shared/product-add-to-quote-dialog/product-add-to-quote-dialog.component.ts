import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ActiveQuoteContextFacade } from '../../facades/active-quote-context.facade';
import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { Quote, QuoteRequest, QuoteStatus } from '../../models/quoting/quoting.model';
import { QuoteEditComponent } from '../quote-edit/quote-edit.component';
import { QuoteInteractionsComponent } from '../quote-interactions/quote-interactions.component';
import { QuoteViewComponent } from '../quote-view/quote-view.component';

@Component({
  selector: 'ish-product-add-to-quote-dialog',
  templateUrl: './product-add-to-quote-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorMessageComponent,
    LoadingComponent,
    NgIf,
    QuoteEditComponent,
    QuoteInteractionsComponent,
    QuoteViewComponent,
    TranslatePipe,
    RouterLink,
  ],
  providers: [{ provide: QuoteContextFacade, useClass: ActiveQuoteContextFacade }],
})
export class ProductAddToQuoteDialogComponent implements OnInit {
  activeQuoteRequest$: Observable<Quote | QuoteRequest>;
  loading$: Observable<boolean>;
  state$: Observable<QuoteStatus>;
  error$: Observable<HttpError>;

  // not-dead-code
  modalRef: NgbModalRef;

  constructor(
    private context: QuoteContextFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.state$ = this.context.select('state');
    this.error$ = this.context.select('error');

    // prevent closing the dialog immediately after opening it
    setTimeout(() => {
      // close dialog if the user clicks a link within the dialog
      this.context.hold(this.router.events.pipe(filter(event => event instanceof NavigationEnd)), () => this.hide());
    }, 1000);
  }

  hide() {
    this.modalRef.dismiss();
  }
}
