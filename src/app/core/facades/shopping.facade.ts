import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounce, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { addProductToBasket } from 'ish-core/store/customer/basket';
import {
  getCategory,
  getCategoryLoading,
  getNavigationCategories,
  getSelectedCategory,
  loadTopLevelCategories,
} from 'ish-core/store/shopping/categories';
import {
  addToCompare,
  getCompareProducts,
  getCompareProductsCount,
  isInCompareProducts,
  removeFromCompare,
  toggleCompare,
} from 'ish-core/store/shopping/compare';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import {
  getProductListingLoading,
  getProductListingView,
  getProductListingViewType,
  loadMoreProducts,
} from 'ish-core/store/shopping/product-listing';
import {
  getProduct,
  getProductBundleParts,
  getProductLinks,
  getProductVariationOptions,
  getProducts,
  getSelectedProduct,
  getSelectedProductVariationOptions,
  loadProductIfNotLoaded,
  loadProductLinks,
} from 'ish-core/store/shopping/products';
import { getPromotion, getPromotions, loadPromotion } from 'ish-core/store/shopping/promotions';
import {
  clearRecently,
  getMostRecentlyViewedProducts,
  getRecentlyViewedProducts,
} from 'ish-core/store/shopping/recently';
import { getSearchTerm, getSuggestSearchResults, suggestSearch } from 'ish-core/store/shopping/search';
import { toObservable } from 'ish-core/utils/functions';
import { whenFalsy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  constructor(private store: Store) {}

  // CATEGORY

  selectedCategory$ = this.store.pipe(select(getSelectedCategory));
  selectedCategoryLoading$ = this.store.pipe(select(getCategoryLoading), debounceTime(500));

  category$(uniqueId: string) {
    return this.store.pipe(select(getCategory(uniqueId)));
  }

  navigationCategories$(uniqueId?: string) {
    if (!uniqueId) {
      this.store.dispatch(loadTopLevelCategories());
    }
    return this.store.pipe(select(getNavigationCategories(uniqueId)));
  }

  // PRODUCT

  selectedProduct$ = this.store.pipe(select(getSelectedProduct));
  selectedProductVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  productDetailLoading$ = this.selectedProduct$.pipe(
    map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.Detail))
  );

  product$(sku: string | Observable<string>, level: ProductCompletenessLevel) {
    return toObservable(sku).pipe(
      tap(plainSKU => this.store.dispatch(loadProductIfNotLoaded({ sku: plainSKU, level }))),
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
    this.store.dispatch(addProductToBasket({ sku, quantity }));
  }

  // PRODUCT LISTING

  productListingView$(id: ProductListingID) {
    return this.store.pipe(select(getProductListingView, id));
  }

  productListingViewType$ = this.store.pipe(select(getProductListingViewType));
  productListingLoading$ = this.store.pipe(select(getProductListingLoading));

  loadMoreProducts(id: ProductListingID, page: number) {
    this.store.dispatch(loadMoreProducts({ id, page }));
  }

  // PRODUCT LINKS

  productLinks$(sku: string) {
    this.store.dispatch(loadProductLinks({ sku }));
    return this.store.pipe(select(getProductLinks, { sku }));
  }

  // SEARCH

  searchTerm$ = this.store.pipe(select(getSearchTerm));
  searchResults$(searchTerm: Observable<string>) {
    return searchTerm.pipe(
      tap(term => this.store.dispatch(suggestSearch({ searchTerm: term }))),
      switchMap(term => this.store.pipe(select(getSuggestSearchResults(term))))
    );
  }
  searchLoading$ = this.store.pipe(select(getProductListingLoading));

  searchItemsCount$ = this.searchTerm$.pipe(
    debounce(() => this.store.pipe(select(getProductListingLoading), whenFalsy())),
    switchMap(term =>
      this.store.pipe(
        select(getProductListingView, { type: 'search', value: term }),
        map(view => view.itemCount)
      )
    )
  );

  // FILTER

  currentFilter$ = this.store.pipe(select(getAvailableFilter));

  // COMPARE

  compareProducts$ = this.store.pipe(select(getCompareProducts));
  compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));

  inCompareProducts$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(switchMap(plainSKU => this.store.pipe(select(isInCompareProducts(plainSKU)))));
  }

  addProductToCompare(sku: string) {
    this.store.dispatch(addToCompare({ sku }));
  }

  toggleProductCompare(sku: string) {
    this.store.dispatch(toggleCompare({ sku }));
  }

  removeProductFromCompare(sku: string) {
    this.store.dispatch(removeFromCompare({ sku }));
  }

  // RECENTLY

  recentlyViewedProducts$ = this.store.pipe(select(getRecentlyViewedProducts));
  mostRecentlyViewedProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));

  clearRecentlyViewedProducts() {
    this.store.dispatch(clearRecently());
  }

  // PROMOTIONS

  promotion$(promotionId: string) {
    this.store.dispatch(loadPromotion({ promoId: promotionId }));
    return this.store.pipe(select(getPromotion(), { promoId: promotionId }));
  }

  promotions$(promotionIds: string[]) {
    promotionIds.forEach(promotionId => {
      this.store.dispatch(loadPromotion({ promoId: promotionId }));
    });
    return this.store.pipe(select(getPromotions(), { promotionIds }));
  }
}
