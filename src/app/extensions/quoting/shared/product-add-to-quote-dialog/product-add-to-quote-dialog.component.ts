import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
export class ProductAddToQuoteDialogComponent implements OnInit, OnDestroy {
  activeQuoteRequest$: Observable<Quote | QuoteRequest>;
  loading$: Observable<boolean>;
  state$: Observable<QuoteStatus>;
  error$: Observable<HttpError>;
  editable$: Observable<boolean>;

  modalRef: NgbModalRef;
  private destroy$ = new Subject();

  constructor(private context: QuoteContextFacade, private router: Router) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.context.entity$;
    this.loading$ = this.context.loading$;
    this.state$ = this.context.state$;
    this.error$ = this.context.error$;
    this.editable$ = this.context.isQuoteRequestEditable$;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.hide());
  }

  hide() {
    this.modalRef.dismiss();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
