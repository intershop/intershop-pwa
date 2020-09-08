import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteRequest } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-product-add-to-quote-dialog',
  templateUrl: './product-add-to-quote-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteDialogComponent implements OnInit {
  activeQuoteRequest$: Observable<QuoteRequest>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.activeQuoteRequest$ = this.quotingFacade.activeQuoteRequest$;
  }
}
