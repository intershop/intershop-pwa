import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounce, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { getCategoryLoading, getSelectedCategory, getTopLevelCategories } from 'ish-core/store/shopping/categories';
import {
  AddToCompare,
  RemoveFromCompare,
  ToggleCompare,
  getCompareProducts,
  getCompareProductsCount,
  isInCompareProducts,
} from 'ish-core/store/shopping/compare';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import {
  LoadMoreProducts,
  getProductListingLoading,
  getProductListingView,
  getProductListingViewType,
} from 'ish-core/store/shopping/product-listing';
import {
  LoadProductIfNotLoaded,
  LoadProductLinks,
  getProduct,
  getProductBundleParts,
  getProductLinks,
  getProductVariationOptions,
  getProducts,
  getSelectedProduct,
  getSelectedProductVariationOptions,
} from 'ish-core/store/shopping/products';
import { LoadPromotion, getPromotion, getPromotions } from 'ish-core/store/shopping/promotions';
import {
  ClearRecently,
  getMostRecentlyViewedProducts,
  getRecentlyViewedProducts,
} from 'ish-core/store/shopping/recently';
import {
  SuggestSearch,
  getCurrentSearchBoxId,
  getSearchTerm,
  getSuggestSearchResult,
  getSuggestSearchTerm,
} from 'ish-core/store/shopping/search';
import { toObservable } from 'ish-core/utils/functions';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  constructor(private store: Store<{}>) {}

  // CATEGORY
  topLevelCategories$ = this.store.pipe(select(getTopLevelCategories));
  selectedCategory$ = this.store.pipe(select(getSelectedCategory));
  selectedCategoryLoading$ = this.store.pipe(
    select(getCategoryLoading),
    debounceTime(500)
  );

  // PRODUCT
  selectedProduct$ = this.store.pipe(select(getSelectedProduct));
  selectedProductVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  productDetailLoading$ = this.selectedProduct$.pipe(
    map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.Detail))
  );

  product$(sku: string | Observable<string>, level: ProductCompletenessLevel) {
    return toObservable(sku).pipe(
      tap(plainSKU => this.store.dispatch(new LoadProductIfNotLoaded({ sku: plainSKU, level }))),
      switchMap(plainSKU =>
        this.store.pipe(
          select(getProduct, { sku: plainSKU }),
          filter(p => ProductHelper.isReadyForDisplay(p, level))
        )
      )
    );
  }

  products$(skus: string[]) {
    return this.store.pipe(select(getProducts, { skus }));
  }

  productVariationOptions$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(
      switchMap(plainSKU => this.store.pipe(select(getProductVariationOptions, { sku: plainSKU })))
    );
  }

  productBundleParts$(sku: string) {
    return this.store.pipe(select(getProductBundleParts, { sku }));
  }

  productNotReady$(sku$: Observable<string>, level: ProductCompletenessLevel) {
    return sku$.pipe(
      switchMap(sku =>
        this.store.pipe(
          select(getProduct, { sku }),
          map(p => !ProductHelper.isReadyForDisplay(p, level))
        )
      )
    );
  }

  // CHECKOUT
  addProductToBasket(sku: string, quantity: number) {
    this.store.dispatch(new AddProductToBasket({ sku, quantity }));
  }

  // PRODUCT LISTING
  productListingView$(id: ProductListingID) {
    return this.store.pipe(select(getProductListingView, id));
  }

  productListingViewType$ = this.store.pipe(select(getProductListingViewType));
  productListingLoading$ = this.store.pipe(select(getProductListingLoading));

  loadMoreProducts(id: ProductListingID, page: number) {
    this.store.dispatch(new LoadMoreProducts({ id, page }));
  }

  // PRODUCT LINKS
  productLinks$(sku: string) {
    this.store.dispatch(new LoadProductLinks({ sku }));
    return this.store.pipe(select(getProductLinks, { sku }));
  }

  // SEARCH
  searchTerm$ = this.store.pipe(select(getSearchTerm));
  suggestSearchTerm$ = this.store.pipe(
    select(getSuggestSearchTerm),
    whenTruthy()
  );
  currentSearchBoxId$ = this.store.pipe(select(getCurrentSearchBoxId));
  searchResults$ = this.store.pipe(select(getSuggestSearchResult));
  searchLoading$ = this.store.pipe(select(getProductListingLoading));

  searchItemsCount$ = this.searchTerm$.pipe(
    debounce(() =>
      this.store.pipe(
        select(getProductListingLoading),
        whenFalsy()
      )
    ),
    switchMap(term =>
      this.store.pipe(
        select(getProductListingView, { type: 'search', value: term }),
        map(view => view.itemCount)
      )
    )
  );

  suggestSearch(searchTerm: string, searchBoxId: string) {
    this.store.dispatch(new SuggestSearch({ searchTerm, id: searchBoxId }));
  }

  // FILTER
  currentFilter$ = this.store.pipe(select(getAvailableFilter));

  // COMPARE
  compareProducts$ = this.store.pipe(select(getCompareProducts));
  compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));

  inCompareProducts$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(switchMap(plainSKU => this.store.pipe(select(isInCompareProducts(plainSKU)))));
  }

  addProductToCompare(sku: string) {
    this.store.dispatch(new AddToCompare({ sku }));
  }

  toggleProductCompare(sku: string) {
    this.store.dispatch(new ToggleCompare({ sku }));
  }

  removeProductFromCompare(sku: string) {
    this.store.dispatch(new RemoveFromCompare({ sku }));
  }

  // RECENTLY
  recentlyViewedProducts$ = this.store.pipe(select(getRecentlyViewedProducts));
  mostRecentlyViewedProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));

  clearRecentlyViewedProducts() {
    this.store.dispatch(new ClearRecently());
  }

  // PROMOTIONS
  promotion$(promotionId: string) {
    this.store.dispatch(new LoadPromotion({ promoId: promotionId }));
    return this.store.pipe(select(getPromotion(), { promoId: promotionId }));
  }

  promotions$(promotionIds: string[]) {
    promotionIds.forEach(promotionId => {
      this.store.dispatch(new LoadPromotion({ promoId: promotionId }));
    });
    return this.store.pipe(select(getPromotions(), { promotionIds }));
  }
}
