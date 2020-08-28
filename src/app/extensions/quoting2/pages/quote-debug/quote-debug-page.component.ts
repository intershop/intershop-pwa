import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { QuotingFacade } from '../../facades/quoting.facade';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuoteStub } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-debug-page',
  templateUrl: './quote-debug-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-creation-test
export class QuoteDebugPageComponent implements OnInit {
  state$: Observable<unknown>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  trackByFn: TrackByFunction<QuoteStub> = (_, stub) => stub.id;

  constructor(private quotingFacade: QuotingFacade) {}

  ngOnInit() {
    this.state$ = this.quotingFacade.quotingEntities$.pipe(map(entities => entities.filter(QuotingHelper.isNotStub)));
    this.loading$ = this.quotingFacade.loading$;
    this.error$ = this.quotingFacade.error$;
  }
}
