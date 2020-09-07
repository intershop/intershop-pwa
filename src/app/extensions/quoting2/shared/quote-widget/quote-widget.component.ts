import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { countBy } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuoteStatus } from '../../models/quoting/quoting.model';

type DisplayState = 'New' | 'Submitted' | 'Accepted' | 'Rejected';

@Component({
  selector: 'ish-quote-widget',
  templateUrl: './quote-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class QuoteWidgetComponent implements OnInit {
  loading$: Observable<boolean>;

  counts$: Observable<Partial<{ [state in DisplayState]: number }>>;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.loading$ = this.quotingFacade.loading$;

    this.counts$ = this.quotingFacade.quotingEntities$.pipe(
      switchMap(quotes => combineLatest(quotes.map(quote => this.quotingFacade.state$(quote.id)))),
      map(quotes => countBy(quotes, quote => this.mapState(quote)))
    );
  }

  mapState(state: QuoteStatus): DisplayState {
    switch (state) {
      case 'Responded':
      case 'Expired':
        return 'Accepted';

      default:
        return state as DisplayState;
    }
  }
}
