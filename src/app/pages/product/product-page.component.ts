import { ApplicationRef, ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SelectedProductContextFacade } from 'ish-core/facades/selected-product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ProductContextFacade, useClass: SelectedProductContextFacade }],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  productLoading$: Observable<boolean>;
  category$: Observable<CategoryView>;

  isMasterProduct = ProductHelper.isMasterProduct;

  private destroy$ = new Subject();

  constructor(
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private featureToggleService: FeatureToggleService,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.context.hold(this.context.select('productAsVariationProduct'), product => this.redirectToVariation(product));

    this.product$ = this.context.select('product');
    this.productLoading$ = this.context.select('loading');

    this.category$ = this.shoppingFacade.selectedCategory$;

    this.product$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(product => {
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
    });
  }

  redirectToVariation(variation: VariationProductView, replaceUrl = false) {
    this.appRef.isStable
      .pipe(
        whenTruthy(),
        take(1),
        map(() => variation),
        whenTruthy(),
        withLatestFrom(this.shoppingFacade.selectedCategory$),
        takeUntil(this.destroy$)
      )
      .subscribe(([product, category]) => {
        this.ngZone.run(() => {
          this.router.navigateByUrl(generateProductUrl(product, category), { replaceUrl });
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
