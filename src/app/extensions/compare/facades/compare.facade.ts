import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCompareState } from '../store/compare-store';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class CompareFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  compareState$ = this.store.pipe(select(getCompareState));
}
