import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, identity } from 'rxjs';
import { debounce, filter, map, pairwise, startWith, switchMap, tap } from 'rxjs/operators';

import { PRICE_UPDATE } from 'ish-core/configurations/injection-keys';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceUpdateType } from 'ish-core/models/price/price.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { selectRouteParam } from 'ish-core/store/core/router';
import { addProductToBasket } from 'ish-core/store/customer/basket';
import { getPriceDisplayType } from 'ish-core/store/customer/user';
import {
  getCategory,
  getCategoryIdByRefId,
  getNavigationCategories,
  getSelectedCategory,
  loadCategoryByRef,
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
import { getSearchTerm, getSuggestSearchResults, suggestSearch } from 'ish-core/store/shopping/search';
import { toObservable } from 'ish-core/utils/functions';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  constructor(private store: Store, @Inject(PRICE_UPDATE) private priceUpdate: PriceUpdateType) {}

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
      filter(categories => !!categories?.length)
    ); // prevent to display an empty navigation bar after login/logout);
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

  productPrices$(sku: string | Observable<string>, fresh = false) {
    return toObservable(sku).pipe(
      whenTruthy(),
      switchMap(plainSKU =>
        combineLatest([
          this.store.pipe(
            select(getProductPrice(plainSKU)),
            // reset state when updates are forced
            this.priceUpdate === 'always' || fresh ? startWith(undefined) : identity,
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

  productVariationCount$(sku: string) {
    return toObservable(sku).pipe(switchMap(plainSKU => this.store.pipe(select(getProductVariationCount(plainSKU)))));
  }

  // CHECKOUT

  addProductToBasket(sku: string, quantity: number) {
    this.store.dispatch(addProductToBasket({ sku, quantity }));
  }

  // PRODUCT LISTING

  productListingView$(id: ProductListingID) {
    this.store.dispatch(loadMoreProducts({ id }));
    return this.store.pipe(select(getProductListingView(id)));
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
}
