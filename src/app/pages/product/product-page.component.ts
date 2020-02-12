import { ApplicationRef, ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { filter, first, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import {
  ProductCompletenessLevel,
  ProductHelper,
  ProductPrices,
  SkuQuantityType,
} from 'ish-core/models/product/product.model';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  productLoading$: Observable<boolean>;
  category$: Observable<CategoryView>;

  quantity: number;
  price$: Observable<ProductPrices>;

  currentUrl$: Observable<string>;

  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;

  private destroy$ = new Subject();
  retailSetParts$ = new ReplaySubject<SkuQuantityType[]>(1);

  constructor(
    private appFacade: AppFacade,
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private featureToggleService: FeatureToggleService,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.product$ = this.shoppingFacade.selectedProduct$;
    this.productVariationOptions$ = this.shoppingFacade.selectedProductVariationOptions$;
    this.category$ = this.shoppingFacade.selectedCategory$;
    this.productLoading$ = this.shoppingFacade.productDetailLoading$;
    this.currentUrl$ = this.appFacade.currentUrl$;

    this.product$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        this.quantity = product.minOrderQuantity;
        if (
          ProductHelper.isMasterProduct(product) &&
          ProductVariationHelper.hasDefaultVariation(product) &&
          !this.featureToggleService.enabled('advancedVariationHandling')
        ) {
          this.redirectToVariation(product.defaultVariation(), true);
        }
        if (ProductHelper.isMasterProduct(product) && this.featureToggleService.enabled('advancedVariationHandling')) {
          this.shoppingFacade.loadMoreProducts({ type: 'master', value: product.sku }, 1);
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
              this.shoppingFacade.products$(parts.map(part => part.sku)).pipe(
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
                this.shoppingFacade.addProductToBasket(sku, quantity);
              })
          );
        } else {
          this.shoppingFacade.addProductToBasket(product.sku, this.quantity);
        }
      });
  }

  addToCompare(sku: string) {
    this.shoppingFacade.addProductToCompare(sku);
  }

  variationSelected(selection: VariationSelection, product: VariationProductView) {
    const variation = ProductVariationHelper.findPossibleVariationForSelection(selection, product);
    this.redirectToVariation(variation);
  }

  redirectToVariation(variation: VariationProductView, replaceUrl = false) {
    const route = variation && generateProductUrl(variation);
    if (route) {
      this.appRef.isStable
        .pipe(
          whenTruthy(),
          first()
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            this.router.navigateByUrl(route, { replaceUrl });
          });
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
