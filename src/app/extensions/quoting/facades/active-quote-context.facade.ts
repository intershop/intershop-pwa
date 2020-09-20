import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getActiveQuoteRequestId } from '../store/quoting';

import { QuoteContextFacade } from './quote-context.facade';

@Injectable()
export class ActiveQuoteContextFacade extends QuoteContextFacade {
  constructor(store: Store) {
    super(store);
    this.connect('id', store.pipe(select(getActiveQuoteRequestId)));
  }
}
