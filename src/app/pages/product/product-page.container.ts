import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper, SkuQuantityType } from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/pipes/product-route.pipe';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { getICMBaseURL } from 'ish-core/store/configuration';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { AddToCompare } from 'ish-core/store/shopping/compare';
import { getSelectedProduct, getSelectedProductVariationOptions } from 'ish-core/store/shopping/products';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent implements OnInit, OnDestroy {
  product$ = this.store.pipe(select(getSelectedProduct));
  quantity: number;
  retailSetParts: SkuQuantityType[];
  productVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  category$ = this.store.pipe(select(getSelectedCategory));
  productLoading$ = this.product$.pipe(map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.Detail)));

  currentUrl$ = this.store.pipe(
    select(getICMBaseURL),
    map(baseUrl => baseUrl + this.location.path())
  );

  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;

  private destroy$ = new Subject();

  constructor(
    private store: Store<{}>,
    private location: Location,
    private router: Router,
    private prodRoutePipe: ProductRoutePipe
  ) {}

  ngOnInit() {
    this.product$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        this.quantity = product.minOrderQuantity;
        if (ProductHelper.isMasterProduct(product)) {
          this.redirectMasterToDefaultVariation(product);
        }
        if (ProductHelper.isRetailSet(product)) {
          this.retailSetParts = product.partSKUs.map(sku => ({ sku, quantity: 1 }));
        }
      });
  }

  addToBasket() {
    this.product$
      .pipe(
        take(1),
        whenTruthy()
      )
      .subscribe(product => {
        if (ProductHelper.isRetailSet(product)) {
          this.retailSetParts
            .filter(({ quantity }) => !!quantity)
            .forEach(({ sku, quantity }) => {
              this.store.dispatch(new AddProductToBasket({ sku, quantity }));
            });
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
    const defaultVariation = ProductVariationHelper.findDefaultVariationForMaster(product);
    this.redirectToVariation(defaultVariation);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
