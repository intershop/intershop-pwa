import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductListingContextFacade } from 'ish-core/facades/product-listing-context.facade';
import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';

/**
 * Displays paging information for robots.
 */
@Component({
  selector: 'ish-product-list-paging',
  templateUrl: './product-list-paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPagingComponent implements OnInit {
  view$: Observable<ProductListingView>;
  page$: Observable<number>;

  constructor(private context: ProductListingContextFacade) {}

  ngOnInit() {
    this.view$ = this.context.select('view');
    this.page$ = this.context.select('page');
  }

  previousPage() {
    console.log('select previous page');
  }

  nextPage() {
    console.log('select next page');
  }

  setPage(val: number) {
    console.log('select page', val);
  }
}
