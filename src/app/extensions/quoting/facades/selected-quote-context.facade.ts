import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { QuoteContextFacade } from './quote-context.facade';

@Injectable()
export class SelectedQuoteContextFacade extends QuoteContextFacade {
  constructor(store: Store) {
    super(store);
    this.connect('id', store.pipe(select(selectRouteParam('quoteId'))));
  }
}
