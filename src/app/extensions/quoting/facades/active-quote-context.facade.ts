import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

import { getActiveQuoteRequestId } from '../store/quoting';

import { QuoteContextFacade } from './quote-context.facade';

@Injectable()
export class ActiveQuoteContextFacade extends QuoteContextFacade {
  constructor(store: Store) {
    super(store);
    this.entity$ = store.pipe(
      select(getActiveQuoteRequestId),
      switchMap(quoteId => this.fetchDetail(quoteId))
    );
  }
}
