import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote, QuoteStatus } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-expiration-date',
  templateUrl: './quote-expiration-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteExpirationDateComponent implements OnChanges {
  @Input() quote: Partial<Pick<Quote, 'id' | 'validToDate'>>;

  state$: Observable<QuoteStatus>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnChanges() {
    this.state$ = this.quotingFacade.state$(this.quote?.id);
  }
}
