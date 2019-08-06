import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import {
  ProductCompletenessLevel,
  ProductHelper,
  ProductPrices,
  SkuQuantityType,
} from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/pipes/product-route.pipe';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { getICMBaseURL } from 'ish-core/store/configuration';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { AddToCompare } from 'ish-core/store/shopping/compare';
import { LoadMoreProducts } from 'ish-core/store/shopping/product-listing';
import { getProducts, getSelectedProduct, getSelectedProductVariationOptions } from 'ish-core/store/shopping/products';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent implements OnInit, OnDestroy {
  product$ = this.store.pipe(select(getSelectedProduct));
  quantity: number;
  price$: Observable<ProductPrices>;
  productVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  category$ = this.store.pipe(select(getSelectedCategory));
  productLoading$ = this.product$.pipe(map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.Detail)));

  currentUrl$ = this.store.pipe(
    select(getICMBaseURL),
    map(baseUrl => baseUrl + this.location.path())
  );

  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;

  private destroy$ = new Subject();
  retailSetParts$ = new ReplaySubject<SkuQuantityType[]>(1);

  constructor(
    private store: Store<{}>,
    private location: Location,
    private router: Router,
    private prodRoutePipe: ProductRoutePipe,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit() {
    this.product$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        this.quantity = product.minOrderQuantity;
        if (ProductHelper.isMasterProduct(product) && !this.featureToggleService.enabled('advancedVariationHandling')) {
          this.redirectMasterToDefaultVariation(product);
        }
        if (ProductHelper.isMasterProduct(product) && this.featureToggleService.enabled('advancedVariationHandling')) {
          this.store.dispatch(new LoadMoreProducts({ id: { type: 'master', value: product.sku }, page: 1 }));
        }
        if (ProductHelper.isRetailSet(product)) {
          this.retailSetParts$.next(product.partSKUs.map(sku => ({ sku, quantity: 1 })));
        }
      });

    this.price$ = this.product$.pipe(
      switchMap(product => {
        if (ProductHelper.isRetailSet(product)) {
          return this.retailSetParts$.pipe(
            filter(parts => !!parts && !!parts.length),
            switchMap(parts =>
              this.store.pipe(
                select(getProducts, { skus: parts.map(part => part.sku) }),
                filter(products =>
                  products.every(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.List))
                ),
                map(ProductHelper.calculatePriceRange)
              )
            )
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  addToBasket() {
    this.product$
      .pipe(
        take(1),
        whenTruthy()
      )
      .subscribe(product => {
        if (ProductHelper.isRetailSet(product)) {
          this.retailSetParts$.pipe(take(1)).subscribe(parts =>
            parts
              .filter(({ quantity }) => !!quantity)
              .forEach(({ sku, quantity }) => {
                this.store.dispatch(new AddProductToBasket({ sku, quantity }));
              })
          );
        } else {
          this.store.dispatch(new AddProductToBasket({ sku: product.sku, quantity: this.quantity }));
        }
      });
  }

  addToCompare(sku: string) {
    this.store.dispatch(new AddToCompare({ sku }));
  }

  variationSelected(selection: VariationSelection, product: VariationProductView) {
    const variation = ProductVariationHelper.findPossibleVariationForSelection(selection, product);
    this.redirectToVariation(variation);
  }

  redirectToVariation(variation: VariationProductView) {
    const route = variation && this.prodRoutePipe.transform(variation);
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  /**
   * Redirect to default variation product if master product is selected.
   */
  redirectMasterToDefaultVariation(product: VariationProductMasterView) {
    if (ProductVariationHelper.hasDefaultVariation(product)) {
      this.redirectToVariation(product.defaultVariation());
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
