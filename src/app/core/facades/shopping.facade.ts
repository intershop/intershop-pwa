import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { selectRouteParam } from 'ish-core/store/core/router';
import { addProductToBasket } from 'ish-core/store/customer/basket';
import {
  getCategory,
  getNavigationCategories,
  getSelectedCategory,
  loadTopLevelCategories,
} from 'ish-core/store/shopping/categories';
import {
  addToCompare,
  getCompareProductsCount,
  getCompareProductsSKUs,
  isInCompareProducts,
  removeFromCompare,
  toggleCompare,
} from 'ish-core/store/shopping/compare';
import {
  getProduct,
  getProductLinks,
  getProductParts,
  getProductVariationCount,
  loadProduct,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductParts,
} from 'ish-core/store/shopping/products';
import { getPromotion, getPromotions, loadPromotion } from 'ish-core/store/shopping/promotions';
import {
  clearRecently,
  getMostRecentlyViewedProducts,
  getRecentlyViewedProducts,
} from 'ish-core/store/shopping/recently';
import { getSearchTerm, getSuggestSearchResults, suggestSearch } from 'ish-core/store/shopping/search';
import { toObservable } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  constructor(private store: Store) {}

  // CATEGORY

  selectedCategory$ = this.store.pipe(select(getSelectedCategory));
  selectedCategoryId$ = this.store.pipe(select(selectRouteParam('categoryUniqueId')));

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

  selectedProductId$ = this.store.pipe(select(selectRouteParam('sku')));

  product$(sku: string | Observable<string>, level: ProductCompletenessLevel | true) {
    const completenessLevel = level === true ? ProductCompletenessLevel.Detail : level;
    return toObservable(sku).pipe(
      tap(plainSKU => {
        if (level === true) {
          this.store.dispatch(loadProduct({ sku: plainSKU }));
        } else {
          this.store.dispatch(loadProductIfNotLoaded({ sku: plainSKU, level }));
        }
      }),
      switchMap(plainSKU =>
        this.store.pipe(
          select(getProduct(plainSKU)),
          filter(p => ProductHelper.isReadyForDisplay(p, completenessLevel))
        )
      )
    );
  }

  productVariationCount$(sku: string) {
    return toObservable(sku).pipe(switchMap(plainSKU => this.store.pipe(select(getProductVariationCount(plainSKU)))));
  }

  // CHECKOUT

  addProductToBasket(sku: string, quantity: number) {
    this.store.dispatch(addProductToBasket({ sku, quantity }));
  }

  // PRODUCT LINKS

  productLinks$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(
      whenTruthy(),
      tap(plainSKU => {
        this.store.dispatch(loadProductLinks({ sku: plainSKU }));
      }),
      switchMap(plainSKU => this.store.pipe(select(getProductLinks(plainSKU))))
    );
  }

  // PRODUCT RETAIL SET / BUNDLES

  productParts$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(
      whenTruthy(),
      tap(plainSKU => {
        this.store.dispatch(loadProductParts({ sku: plainSKU }));
      }),
      switchMap(plainSKU => this.store.pipe(select(getProductParts(plainSKU))))
    );
  }

  // SEARCH

  searchTerm$ = this.store.pipe(select(getSearchTerm));
  searchResults$(searchTerm: Observable<string>) {
    return searchTerm.pipe(
      tap(term => this.store.dispatch(suggestSearch({ searchTerm: term }))),
      switchMap(term => this.store.pipe(select(getSuggestSearchResults(term))))
    );
  }

  // COMPARE

  compareProducts$ = this.store.pipe(select(getCompareProductsSKUs));
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
    return this.store.pipe(select(getPromotion(promotionId)));
  }

  promotions$(promotionIds: string[]) {
    promotionIds.forEach(promotionId => {
      this.store.dispatch(loadPromotion({ promoId: promotionId }));
    });
    return this.store.pipe(select(getPromotions(promotionIds)));
  }
}
