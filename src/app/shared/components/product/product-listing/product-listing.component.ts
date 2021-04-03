import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductListingContextFacade } from 'ish-core/facades/product-listing-context.facade';
import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-listing',
  templateUrl: './product-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListingComponent implements OnInit {
  productListingView$: Observable<ProductListingView>;
  viewType$: Observable<ViewType>;
  listingLoading$: Observable<boolean>;
  currentPage$: Observable<number>;
  sortBy$: Observable<string>;

  constructor(private context: ProductListingContextFacade) {}

  ngOnInit() {
    this.productListingView$ = this.context.select('view');
    this.viewType$ = this.context.select('viewType');
    this.listingLoading$ = this.context.select('loading');
    this.currentPage$ = this.context.select('page');
    this.sortBy$ = this.context.select('sorting');
  }
}
