import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { VariationProductMasterView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { getICMBaseURL } from 'ish-core/store/configuration';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { AddToCompare } from 'ish-core/store/shopping/compare';
import {
  getProductLoading,
  getSelectedProduct,
  getSelectedProductVariationOptions,
} from 'ish-core/store/shopping/products';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent implements OnInit {
  product$ = this.store.pipe(select(getSelectedProduct));
  productVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  category$ = this.store.pipe(select(getSelectedCategory));
  productLoading$ = this.store.pipe(select(getProductLoading));
  currentUrl$ = this.store.pipe(
    select(getICMBaseURL),
    map(baseUrl => baseUrl + this.location.path())
  );

  constructor(private store: Store<{}>, private location: Location, private router: Router) {}

  ngOnInit() {
    this.product$
      .pipe(
        whenTruthy(),
        take(1)
      )
      .subscribe(product => {
        if (ProductHelper.isMasterProduct(product)) {
          this.redirectMasterToDefaultVariation(product);
        }
      });
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku, quantity }));
  }

  addToCompare(sku: string) {
    this.store.dispatch(new AddToCompare({ sku }));
  }

  /**
   * Redirect to default variation product if master product is selected.
   */
  redirectMasterToDefaultVariation(product: VariationProductMasterView) {
    const defaultVariation = this.findDefaultVariation(product);

    if (defaultVariation) {
      const sku = defaultVariation.uri.split('/').pop();
      this.router.navigate(['/product', sku]);
    }
  }

  findDefaultVariation(product: VariationProductMasterView) {
    return product.variations.find(
      variation =>
        variation.attributes &&
        variation.attributes[0] &&
        variation.attributes[0].name === 'defaultVariation' &&
        variation.attributes[0].value === true
    );
  }
}
