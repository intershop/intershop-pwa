import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, distinctUntilChanged, map, scan, startWith, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { SolrInstantsearchFacade } from '../../facades/solr-instantsearch.facade';

@Component({
  selector: 'ish-instant-search-result',
  templateUrl: './instant-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantSearchResultComponent implements OnInit, OnDestroy {
  /**
   * The the search term leading to the displayed result.
   */
  searchTerm$: Observable<string>;
  numberOfItems$: Observable<number>;

  toggleCollapsed$ = new Subject<void>();
  isCollapsed$: Observable<boolean>;

  productListingID$: Observable<ProductListingID>;

  constructor(
    private appFacade: AppFacade,
    private instantSearchFacade: InstantSearchFacade,
    private solrInstantsearchFacade: SolrInstantsearchFacade
  ) {}

  ngOnInit() {
    this.searchTerm$ = this.instantSearchFacade.select('query');

    this.isCollapsed$ = this.appFacade.deviceType$.pipe(
      map(deviceType => deviceType === 'mobile'),
      distinctUntilChanged(),
      switchMap(defaultValue =>
        this.toggleCollapsed$.pipe(
          scan((state, _curr) => !state, true),
          startWith(defaultValue)
        )
      )
    );
    this.searchTerm$ = this.instantSearchFacade.select('query');
    this.numberOfItems$ = this.solrInstantsearchFacade.numberOfItems$;
    this.productListingID$ = this.solrInstantsearchFacade.currentProductListingID$.pipe(whenTruthy());
  }

  toggle() {
    this.toggleCollapsed$.next();
    if (!SSR) {
      window.scroll(0, 0);
    }
  }

  ngOnDestroy(): void {
    this.toggleCollapsed$.complete();
  }
}
