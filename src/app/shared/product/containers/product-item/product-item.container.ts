import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { ToggleCompare, isInCompareProducts } from 'ish-core/store/shopping/compare';
import { LoadProduct, getProduct, getProductVariationOptions } from 'ish-core/store/shopping/products';
import { whenFalsy } from 'ish-core/utils/operators';

type ProductItemType = 'tile' | 'row';

@Component({
  selector: 'ish-product-item-container',
  templateUrl: './product-item.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemContainerComponent implements OnInit {
  @Input() productSku: string;
  @Input() category?: Category;
  @Input() type: ProductItemType;

  product$: Observable<Product>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  isInCompareList$: Observable<boolean>;

  constructor(private store: Store<{}>) {}

  private setUpStoreData(sku: string) {
    this.product$ = this.store.pipe(select(getProduct, { sku }));
    this.productVariationOptions$ = this.store.pipe(select(getProductVariationOptions, { sku }));
    // Checks if the product is already in the store and only dispatches a LoadProduct action if it is not
    this.product$
      .pipe(
        take(1),
        whenFalsy()
      )
      .subscribe(() => this.store.dispatch(new LoadProduct({ sku })));
    this.isInCompareList$ = this.store.pipe(select(isInCompareProducts(sku)));
  }

  ngOnInit() {
    this.setUpStoreData(this.productSku);
  }

  toggleCompare() {
    this.product$.pipe(take(1)).subscribe(product => this.store.dispatch(new ToggleCompare({ sku: product.sku })));
  }

  addToBasket(quantity: number) {
    this.product$
      .pipe(take(1))
      .subscribe(product => this.store.dispatch(new AddProductToBasket({ sku: product.sku, quantity })));
  }

  replaceVariation(selection: VariationSelection) {
    this.product$
      .pipe(
        take(1),
        filter(product => ProductHelper.isVariationProduct(product))
      )
      .subscribe((product: VariationProductView) => {
        const variation = ProductVariationHelper.findPossibleVariationForSelection(selection, product);
        const newSku = variation && variation.uri.split('/').pop();

        this.setUpStoreData(newSku);
      });
  }

  get isTile() {
    return this.type === 'tile';
  }

  get isRow() {
    return this.type === 'row';
  }
}
