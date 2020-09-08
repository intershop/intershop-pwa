import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

import { selectRouteParam } from 'ish-core/store/core/router';

import { QuoteContextFacade } from './quote-context.facade';

@Injectable()
export class SelectedQuoteContextFacade extends QuoteContextFacade {
  constructor(store: Store) {
    super(store);
    this.entity$ = store.pipe(
      select(selectRouteParam('quoteId')),
      switchMap(quoteId => this.fetchDetail(quoteId))
    );
  }
}
