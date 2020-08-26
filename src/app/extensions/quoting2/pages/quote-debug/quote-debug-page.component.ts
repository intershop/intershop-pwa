import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { QuoteStub } from '../../models/quoting/quoting.model';
import { QuotingService } from '../../services/quoting/quoting.service';

@Component({
  selector: 'ish-quote-debug-page',
  templateUrl: './quote-debug-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-creation-test
export class QuoteDebugPageComponent implements OnInit {
  quotes$: Observable<unknown>;

  trackByFn: TrackByFunction<QuoteStub> = (_, stub) => stub.id;

  // tslint:disable-next-line: no-intelligence-in-artifacts
  constructor(private quotingService: QuotingService) {}

  ngOnInit() {
    this.quotes$ = this.quotingService
      .getQuotes()
      .pipe(switchMap(quotes => forkJoin(quotes.map(q => this.quotingService.getQuoteDetails(q, 'Detail')))));
  }
}
