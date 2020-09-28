import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  modalRef: NgbModalRef;

  constructor(private context: QuoteContextFacade, private router: Router) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.state$ = this.context.select('state');
    this.error$ = this.context.select('error');

    this.context.hold(this.router.events.pipe(filter(event => event instanceof NavigationEnd)), () => this.hide());
  }

  hide() {
    this.modalRef.dismiss();
  }
}
