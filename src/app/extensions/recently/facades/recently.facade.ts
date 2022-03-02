import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { clearRecently, getMostRecentlyViewedProducts, getRecentlyViewedProducts } from '../store/recently';

@Injectable({ providedIn: 'root' })
export class RecentlyFacade {
  constructor(private store: Store) {}

  recentlyViewedProducts$ = this.store.pipe(select(getRecentlyViewedProducts));
  mostRecentlyViewedProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));

  clearRecentlyViewedProducts() {
    this.store.dispatch(clearRecently());
  }
}
