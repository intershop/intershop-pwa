import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getQuoting2State } from '../store/quoting2-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class QuotingFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  quotingState$ = this.store.pipe(select(getQuoting2State));
}
