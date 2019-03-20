import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { ToggleCompare, isInCompareProducts } from 'ish-core/store/shopping/compare';
import { LoadProduct, getProduct, getProductVariationOptions } from 'ish-core/store/shopping/products';

@Component({
  selector: 'ish-product-tile-container',
  templateUrl: './product-tile.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileContainerComponent implements OnInit {
  @Input() productSku: string;
  @Input() category?: Category;
  @Output() selectVariation = new EventEmitter<{ selection: VariationSelection; product: VariationProductView }>();

  product$: Observable<Product>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  isInCompareList$: Observable<boolean>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.product$ = this.store.pipe(select(getProduct, { sku: this.productSku }));
    this.productVariationOptions$ = this.store.pipe(select(getProductVariationOptions, { sku: this.productSku }));
    // Checks if the product is already in the store and only dispatches a LoadProduct action if it is not
    this.product$
      .pipe(
        take(1),
        filter(x => !x)
      )
      .subscribe(() => this.store.dispatch(new LoadProduct({ sku: this.productSku })));
    this.isInCompareList$ = this.store.pipe(select(isInCompareProducts(this.productSku)));
  }

  toggleCompare() {
    this.store.dispatch(new ToggleCompare({ sku: this.productSku }));
  }

  addToBasket() {
    this.product$
      .pipe(take(1))
      .subscribe(product =>
        this.store.dispatch(new AddProductToBasket({ sku: product.sku, quantity: product.minOrderQuantity }))
      );
  }

  variationSelected({ selection, product }: { selection: VariationSelection; product: VariationProductView }) {
    this.selectVariation.emit({ selection, product });
  }
}
