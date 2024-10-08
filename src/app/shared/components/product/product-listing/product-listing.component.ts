import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, map, take, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductListingID, ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-listing',
  templateUrl: './product-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // merged query parameters for product detail links are needed to apply previously selected filter options for variation masters too
  providers: [{ provide: 'PRODUCT_QUERY_PARAMS_HANDLING', useValue: 'merge' }],
})
export class ProductListingComponent implements OnInit {
  @Input() categoryId: string;
  // TODO: make this a proper signal with the next Angular version
  @Input() set productListingId(value: ProductListingID) {
    this.productListingId$.next(value);
  }
  @Input() mode: 'endless-scrolling' | 'paging' = 'endless-scrolling';
  @Input() fragmentOnRouting = 'product-list-top';

  productListingView$: Observable<ProductListingView>;
  viewType$: Observable<ViewType>;
  listingLoading$: Observable<boolean>;
  currentPage$: Observable<number>;
  sortBy$: Observable<string>;

  private productListingId$ = new BehaviorSubject<ProductListingID>(undefined);

  private destroyRef = inject(DestroyRef);

  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.viewType$ = this.shoppingFacade.productListingViewType$;
    this.listingLoading$ = this.shoppingFacade.productListingLoading$;
    this.currentPage$ = this.activatedRoute.queryParamMap.pipe(map(params => +params.get('page') || 1));
    this.sortBy$ = this.activatedRoute.queryParamMap.pipe(map(params => params.get('sorting')));
    this.productListingView$ = this.shoppingFacade.productListingView$(this.productListingId$);

    // append view queryParam to URL if none is set
    this.activatedRoute.queryParamMap
      .pipe(
        map(params => params.has('view')),
        take(1),
        whenFalsy(),
        concatMap(() => this.viewType$.pipe(whenTruthy(), take(1))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(view => this.changeViewType(view));
  }

  /**
   * Emits the event for switching the view type of the product list.
   *
   * @param view The new view type.
   */
  private changeViewType(view: ViewType) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      replaceUrl: true,
      queryParamsHandling: 'merge',
      queryParams: { view },
    });
  }

  /**
   * Emits the event for loading more products.
   */
  loadMoreProducts(direction: 'up' | 'down') {
    this.productListingView$
      .pipe(
        take(1),
        map(view => (direction === 'down' ? view.nextPage() : view.previousPage())),
        whenTruthy(),
        withLatestFrom(this.productListingId$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([page, id]) => {
        this.shoppingFacade.loadMoreProducts(id, page);
      });
  }

  get isEndlessScrolling() {
    return this.mode === 'endless-scrolling';
  }

  get isPaging() {
    return !this.isEndlessScrolling;
  }
}
