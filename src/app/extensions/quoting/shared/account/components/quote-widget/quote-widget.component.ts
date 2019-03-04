import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { QuoteRequest, QuoteRequestStateType } from '../../../../models/quote-request/quote-request.model';
import { Quote, QuoteStateType } from '../../../../models/quote/quote.model';

type StateType = QuoteRequestStateType | QuoteStateType;

/**
 * The Quote Widget Component lists the existing quotes grouped by state.
 *
 * @example
 * <ish-quote-widget [quoteRequests]="quoteRequests" [quotes]="quotes"></ish-quote-widget>
 */
@Component({
  selector: 'ish-quote-widget',
  templateUrl: './quote-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteWidgetComponent implements OnChanges {
  @Input() quoteRequests: QuoteRequest[];
  @Input() quotes: Quote[];

  counts: { [state in StateType]?: number };

  ngOnChanges(): void {
    this.calculateNumbers();
  }

  private calculateNumbers() {
    this.counts = [...this.quotes, ...this.quoteRequests]
      // perform groupBy + count
      .reduce((acc, val) => {
        acc[val.state] = acc[val.state] + 1 || 1;
        return acc;
      }, {});
  }

  getCount(state: StateType): number {
    return this.counts[state] || 0;
  }

  getAcceptedCount(): number {
    return this.getCount('Responded') + this.getCount('Expired') + this.getCount('Converted');
  }
}
