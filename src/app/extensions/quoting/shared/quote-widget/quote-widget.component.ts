import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { QuotingFacade } from '../../facades/quoting.facade';

@Component({
  selector: 'ish-quote-widget',
  templateUrl: './quote-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class QuoteWidgetComponent implements OnInit {
  loading$: Observable<boolean>;

  respondedQuotes$: Observable<number>;
  submittedQuoteRequests$: Observable<number>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.loading$ = this.quotingFacade.loading$;

    const quotingStates$ = this.quotingFacade
      .quotingEntities$()
      .pipe(
        switchMap(quotes =>
          iif(() => !quotes?.length, of([]), combineLatest(quotes.map(quote => this.quotingFacade.state$(quote.id))))
        )
      );

    this.respondedQuotes$ = quotingStates$.pipe(map(states => states.filter(state => state === 'Responded').length));
    this.submittedQuoteRequests$ = quotingStates$.pipe(
      map(states => states.filter(state => state === 'Submitted').length)
    );
  }
}
