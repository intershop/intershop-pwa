import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { countBy } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { QuoteRequest } from '../../../models/quote-request/quote-request.model';
import { Quote } from '../../../models/quote/quote.model';

type DisplayState = 'New' | 'Submitted' | 'Accepted' | 'Rejected';

@Component({
  selector: 'ish-quote-widget',
  templateUrl: './quote-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-markup-in-containers
export class QuoteWidgetComponent implements OnInit {
  loading$: Observable<boolean>;

  counts$: Observable<Partial<{ [state in DisplayState]: number }>>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.loading$ = this.quotingFacade.quotesOrQuoteRequestsLoading$;

    this.counts$ = this.quotingFacade
      .quotesAndQuoteRequests$()
      .pipe(map(quotes => countBy(quotes, quote => this.mapState(quote))));
  }

  mapState(quote: Quote | QuoteRequest): DisplayState {
    switch (quote.state) {
      case 'Responded':
      case 'Expired':
      case 'Converted':
        return 'Accepted';

      default:
        return quote.state;
    }
  }
}
