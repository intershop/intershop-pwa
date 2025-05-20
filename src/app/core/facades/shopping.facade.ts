import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Observable, combineLatest, identity } from 'rxjs';
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { PRICE_UPDATE } from 'ish-core/configurations/injection-keys';
import { AddLineItemType } from 'ish-core/models/line-item/line-item.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { selectRouteParam } from 'ish-core/store/core/router';
import { addItemsToBasket, addProductToBasket } from 'ish-core/store/customer/basket';
import { getPriceDisplayType } from 'ish-core/store/customer/user';
import {
  getCategory,
  getCategoryIdByRefId,
  getNavigationCategories,
  getNavigationCategoryTree,
  getSelectedCategory,
  loadCategoryByRef,
  loadCategoryTree,
  loadTopLevelCategories,
} from 'ish-core/store/shopping/categories';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import {
  getProductListingLoading,
  getProductListingView,
  getProductListingViewType,
  loadMoreProducts,
} from 'ish-core/store/shopping/product-listing';
import { loadProductPrices } from 'ish-core/store/shopping/product-prices';
import { getProductPrice } from 'ish-core/store/shopping/product-prices/product-prices.selectors';
import {
  getFailedProducts,
  getProduct,
  getProductLinks,
  getProductParts,
  getProductVariationCount,
  getProductVariations,
  loadProduct,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductParts,
  loadProductVariationsIfNotLoaded,
} from 'ish-core/store/shopping/products';
import { getPromotion, getPromotions, loadPromotion } from 'ish-core/store/shopping/promotions';
import {
  getSearchTerm,
  getSearchedTerms,
  getSuggestSearchLoading,
  getSuggestSearchResults,
  removeSuggestions,
  suggestSearch,
} from 'ish-core/store/shopping/search';
import { getWarranty, getWarrantyError, getWarrantyLoading, warrantyActions } from 'ish-core/store/shopping/warranties';
import { toObservable } from 'ish-core/utils/functions';
import { InjectSingle } from 'ish-core/utils/injection';
import { mapToProperty, whenFalsy, whenTruthy } from 'ish-core/utils/operators';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  constructor(private store: Store, @Inject(PRICE_UPDATE) private priceUpdate: InjectSingle<typeof PRICE_UPDATE>) {}

  // CATEGORY

  selectedCategory$ = this.store.pipe(select(getSelectedCategory));
  selectedCategoryId$ = this.store.pipe(select(selectRouteParam('categoryUniqueId')));

  category$(uniqueId: string) {
    return this.store.pipe(select(getCategory(uniqueId)));
  }

  categoryIdByRefId$(categoryRefId: string) {
    this.store.dispatch(loadCategoryByRef({ categoryId: categoryRefId }));
    return this.store.pipe(select(getCategoryIdByRefId(categoryRefId)));
  }

  navigationCategories$(uniqueId?: string) {
    if (!uniqueId) {
      this.store.dispatch(loadTopLevelCategories());
    }
    return this.store.pipe(
      select(getNavigationCategories(uniqueId)),
      // prevent to display an empty navigation bar after login/logout);
      filter(categories => !!categories?.length)
    );
  }

  navigationCategoryTree$(categoryRef: string, depth: number) {
    this.store.dispatch(loadCategoryTree({ categoryRef, depth }));
    return this.store.pipe(select(getNavigationCategoryTree(categoryRef, depth)));
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
          startWith(undefined),
          pairwise(),
          tap(([prev, curr]) => {
            if (
              ProductHelper.isReadyForDisplay(prev, completenessLevel) &&
              !ProductHelper.isReadyForDisplay(curr, completenessLevel)
            ) {
              level === true
                ? this.store.dispatch(loadProduct({ sku: plainSKU }))
                : this.store.dispatch(loadProductIfNotLoaded({ sku: plainSKU, level }));
            }
          }),
          map(([, curr]) => curr),
          filter(p => ProductHelper.isReadyForDisplay(p, completenessLevel))
        )
      )
    );
  }

  failedProducts$ = this.store.pipe(select(getFailedProducts));

  // remove all SKUs from the productSKUs that are also contained in the failed products
  excludeFailedProducts$(productSKUs: string[] | Observable<string[]>) {
    return combineLatest([toObservable(productSKUs), this.store.pipe(select(getFailedProducts))]).pipe(
      distinctUntilChanged<[string[], string[]]>(isEqual),
      map(([skus, failed]) => skus.filter(sku => !failed.includes(sku)))
    );
  }

  productPrices$(sku: string | Observable<string>, fresh = false) {
    return toObservable(sku).pipe(
      whenTruthy(),
      switchMap(plainSKU =>
        combineLatest([
          this.store.pipe(
            select(getProductPrice(plainSKU)),
            // reset state when updates are forced
            this.priceUpdate === 'always' || fresh ? startWith(undefined) : identity,
            distinctUntilChanged(),
            tap(prices => {
              if (!prices) {
                this.store.dispatch(loadProductPrices({ skus: [plainSKU] }));
              }
            }),
            whenTruthy()
          ),
          this.store.pipe(select(getPriceDisplayType)),
        ]).pipe(map(args => PriceItemHelper.selectPricing(...args)))
      )
    );
  }

  private lazyLoadVariations(sku: string | Observable<string>) {
    return this.product$(sku, ProductCompletenessLevel.List).pipe(
      whenTruthy(),
      filter(ProductHelper.isMasterProduct),
      mapToProperty('sku'),
      distinctUntilChanged(),
      tap(sku => {
        this.store.dispatch(loadProductVariationsIfNotLoaded({ sku }));
      })
    );
  }

  productVariations$(sku: string | Observable<string>) {
    return this.lazyLoadVariations(sku).pipe(switchMap(sku => this.store.pipe(select(getProductVariations(sku)))));
  }

  productVariationCount$(sku: string | Observable<string>) {
    return this.lazyLoadVariations(sku).pipe(
      switchMap(plainSKU => this.store.pipe(select(getProductVariationCount(plainSKU))))
    );
  }

  // CHECKOUT

  addProductToBasket(sku: string, quantity: number, warrantySku?: string) {
    this.store.dispatch(addProductToBasket({ sku, quantity, warrantySku }));
  }

  addProductsToBasket(items: AddLineItemType[]) {
    this.store.dispatch(addItemsToBasket({ items }));
  }

  // PRODUCT LISTING

  productListingView$(id: ProductListingID | Observable<ProductListingID>) {
    return toObservable(id).pipe(
      whenTruthy(),
      tap(id => this.store.dispatch(loadMoreProducts({ id }))),
      switchMap(id => this.store.pipe(select(getProductListingView(id))))
    );
  }

  productListingViewType$ = this.store.pipe(select(getProductListingViewType));
  productListingLoading$ = this.store.pipe(select(getProductListingLoading));

  loadMoreProducts(id: ProductListingID, page: number) {
    this.store.dispatch(loadMoreProducts({ id, page }));
  }

  // PRODUCT LINKS

  productLinks$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(
      whenTruthy(),
      switchMap(plainSKU =>
        this.store.pipe(
          select(getProductLinks(plainSKU)),
          tap(links => {
            if (!links) {
              this.store.dispatch(loadProductLinks({ sku: plainSKU }));
            }
          })
        )
      )
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
  recentSearchTerms$ = this.store.pipe(select(getSearchedTerms));
  searchTerm$ = this.store.pipe(select(getSearchTerm));

  suggestResults$(searchTerm: Observable<string>) {
    return searchTerm.pipe(
      debounceTime(400),
      filter(term => term.length > 2),
      tap(term => this.store.dispatch(suggestSearch({ searchTerm: term }))),
      switchMap(() => this.store.pipe(select(getSuggestSearchResults)))
    );
  }

  clearSuggestSearchSuggestions() {
    this.store.dispatch(removeSuggestions());
  }

  searchSuggestLoading$ = this.store.pipe(select(getSuggestSearchLoading));

  searchLoading$ = this.store.pipe(select(getProductListingLoading));

  searchItemsCount$ = this.searchTerm$.pipe(
    debounce(() => this.store.pipe(select(getProductListingLoading), whenFalsy())),
    switchMap(term =>
      this.store.pipe(
        select(getProductListingView({ type: 'search', value: term })),
        map(view => view.itemCount)
      )
    )
  );

  // FILTER

  currentFilter$(withCategoryFilter: boolean) {
    return this.store.pipe(
      select(getAvailableFilter),
      whenTruthy(),
      map(x => (withCategoryFilter ? x : { ...x, filter: x.filter?.filter(f => f.id !== 'CategoryUUIDLevelMulti') }))
    );
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

  // WARRANTIES

  warrantyById$(warrantyId: string) {
    this.store.dispatch(warrantyActions.loadWarranty({ warrantyId }));
    return this.store.pipe(select(getWarranty(warrantyId)));
  }

  warrantyError$ = this.store.pipe(select(getWarrantyError));
  warrantyLoading$ = this.store.pipe(select(getWarrantyLoading));
}
