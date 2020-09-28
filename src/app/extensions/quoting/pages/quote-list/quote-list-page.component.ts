import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote, QuoteRequest } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-list-page',
  templateUrl: './quote-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageComponent implements OnInit {
  loading$: Observable<boolean>;
  quotes$: Observable<(Quote | QuoteRequest)[]>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.quotes$ = this.quotingFacade.quotingEntities$();
    this.loading$ = this.quotingFacade.loading$;
  }

  deleteItem(item: Quote | QuoteRequest) {
    this.quotingFacade.delete(item);
  }
}
