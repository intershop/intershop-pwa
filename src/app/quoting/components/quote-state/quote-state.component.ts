import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { interval } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';

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
  @Input() quote: Quote | QuoteRequest;

  validToDate: number;

  currentDateTime$ = interval(1000).pipe(startWith(0), mapTo(Date.now()));

  ngOnChanges() {
    this.validToDate = undefined;

    const quote = this.quote as Quote;

    if (quote.validToDate) {
      this.validToDate = quote.validToDate;
    }
  }
}
