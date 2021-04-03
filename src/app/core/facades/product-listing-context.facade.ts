import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ProductListingView } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { selectQueryParam } from 'ish-core/store/core/router';
import { getProductListingLoading, getProductListingView } from 'ish-core/store/shopping/product-listing';
import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export interface ProductListingContext {
  type: 'category' | 'search' | 'master';
  value: string;

  fragmentOnRouting: string;
  categoryId: string;
  mode: 'endless-scrolling' | 'paging';

  sorting: string;
  filters: URLFormParams;
  page: number;
  viewType: ViewType;

  view: ProductListingView;
  loading: boolean;
}

export class ProductListingContextFacade extends RxState<ProductListingContext> {
  constructor(private store: Store, private router: Router) {
    super();

    this.set(() => ({
      fragmentOnRouting: 'product-list-top',
      mode: 'endless-scrolling',
      viewType: 'grid',
    }));

    this.connect('loading', this.store.pipe(select(getProductListingLoading)));

    this.connect(
      'page',
      this.store.pipe(
        select(selectQueryParam('page')),
        map(page => +page || 1)
      )
    );

    this.connect('sorting', this.store.pipe(select(selectQueryParam('sorting'))));

    this.connect(
      'viewType',
      this.store.pipe(select(selectQueryParam('view'))),
      (state, routingView) => (routingView as ViewType) || state.viewType
    );

    this.connect(
      'view',
      combineLatest([this.select('type').pipe(whenTruthy()), this.select('value').pipe(whenTruthy())]).pipe(
        switchMap(([type, value]) => this.store.pipe(select(getProductListingView({ type, value }))))
      )
    );
  }

  changeViewType(view: ViewType) {
    this.router.navigate([], {
      // relativeTo: this.activatedRoute,
      // replaceUrl: true,
      queryParamsHandling: 'merge',
      queryParams: { view },
      fragment: this.get('fragmentOnRouting'),
    });
  }

  changeSorting(sorting: string) {
    this.router.navigate([], {
      // relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: { sorting, page: 1 },
      fragment: this.get('fragmentOnRouting'),
    });
  }
}
