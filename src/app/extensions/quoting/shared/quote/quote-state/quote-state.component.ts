import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

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
export class QuoteStateComponent implements OnChanges, OnInit {
  @Input() quote: Quote | QuoteRequest;

  validToDate: number;

  currentDateTime$: Observable<number>;

  ngOnInit() {
    this.currentDateTime$ = timer(0, 1000).pipe(mapTo(Date.now()));
  }

  ngOnChanges() {
    this.validToDate = undefined;

    const quote = this.quote as Quote;

    if (quote.validToDate) {
      this.validToDate = quote.validToDate;
    }
  }
}
