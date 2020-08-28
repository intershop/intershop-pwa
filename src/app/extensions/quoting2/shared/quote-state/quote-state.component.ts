import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteStatus } from '../../models/quoting/quoting.model';

/**
 * The Quote State Component displays the current state of a quote.
 *
 * @example
 * <ish-quote-state [quote]="quote"></ish-quote-state>
 */
@Component({
  selector: 'ish-quote-state',
  templateUrl: './quote-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteStateComponent implements OnChanges {
  @Input() quoteId: string;

  state$: Observable<QuoteStatus>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnChanges() {
    this.state$ = this.quotingFacade.state$(this.quoteId);
  }
}
