import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { debounce, delay, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { getProductListingLoading, getProductListingView } from 'ish-core/store/shopping/product-listing';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { getProductListingID } from '../store/solr-instant-search/solr-instant-search.selector';

@Injectable({ providedIn: 'root' })
export class SolrInstantsearchFacade {
  constructor(private store: Store) {}

  currentProductListingID$ = this.store.pipe(select(getProductListingID));

  numberOfItems$ = this.currentProductListingID$.pipe(
    distinctUntilChanged(),
    whenTruthy(),
    switchMap(productListID =>
      this.store.pipe(
        select(getProductListingView(productListID)),
        map(view => view.itemCount),
        debounce(() => this.store.pipe(select(getProductListingLoading), whenFalsy())),
        switchMap(value => (value === 0 ? of(value).pipe(delay(2000)) : of(value)))
      )
    )
  );
}
