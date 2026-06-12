import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductListingID, ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';

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

  scrollDistance = 2; // = 20%

  private productListingId$ = new BehaviorSubject<ProductListingID>(undefined);

  private destroyRef = inject(DestroyRef);

  constructor(
    private shoppingFacade: ShoppingFacade,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.viewType$ = this.shoppingFacade.productListingViewType$;
    this.listingLoading$ = this.shoppingFacade.productListingLoading$;
    this.currentPage$ = this.activatedRoute.queryParamMap.pipe(map(params => +params.get('page') || 1));
    this.sortBy$ = this.activatedRoute.queryParamMap.pipe(map(params => params.get('sorting')));
    this.productListingView$ = this.shoppingFacade.productListingView$(this.productListingId$);
  }

  /**
   * Emits the event for loading more products.
   */
  loadMoreProducts(direction: 'down' | 'up') {
    this.productListingView$
      .pipe(
        take(1),
        map(view => (direction === 'down' ? view.nextPage() : view.previousPage())),
        whenTruthy(),
        withLatestFrom(this.productListingId$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([page, id]) => {
        // jump back to the list if only the footer is visible to prevent endless fetching
        if (direction === 'down' && !SSR && window.innerHeight < 500) {
          this.elementRef.nativeElement.scrollIntoView({ block: 'end' });
        }
        this.shoppingFacade.loadMoreProducts(id, page);
        // decrease the scroll distance percentage if the list gets longer to prevent endless product fetching
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).Cypress) {
          this.scrollDistance = 2 / (page + 1);
        }
      });
  }

  get isEndlessScrolling() {
    return this.mode === 'endless-scrolling';
  }

  get isPaging() {
    return !this.isEndlessScrolling;
  }
}
