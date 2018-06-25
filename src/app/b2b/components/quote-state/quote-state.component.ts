import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { interval } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
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
export class QuoteStateComponent {
  @Input() quote: Quote;

  currentDateTime$ = interval(1000).pipe(startWith(0), mapTo(Date.now()));
}
