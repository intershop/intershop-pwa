import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { OperatorFunction, map, withLatestFrom } from 'rxjs';

import { getFailedProducts } from 'ish-core/store/shopping/products';

import { clearRecently, getMostRecentlyViewedProducts, getRecentlyViewedProducts } from '../store/recently';

@Injectable({ providedIn: 'root' })
export class RecentlyFacade {
  constructor(private store: Store) {}

  recentlyViewedProducts$ = this.store.pipe(select(getRecentlyViewedProducts), this.excludeFailedProducts());
  mostRecentlyViewedProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts), this.excludeFailedProducts());

  excludeFailedProducts(): OperatorFunction<string[], string[]> {
    return source$ =>
      source$.pipe(
        withLatestFrom(this.store.pipe(select(getFailedProducts))),
        map(([products, failedProducts]) => products.filter(product => !failedProducts.includes(product)))
      );
  }

  clearRecentlyViewedProducts() {
    this.store.dispatch(clearRecently());
  }
}
