import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';
import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { ToggleCompare, isInCompareProducts } from 'ish-core/store/shopping/compare';

@Component({
  selector: 'ish-product-row-container',
  templateUrl: './product-row.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowContainerComponent implements OnInit {
  @Input() product: Product;
  @Input() category?: Category;

  isInCompareList$: Observable<boolean>;

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.isInCompareList$ = this.store.pipe(select(isInCompareProducts(this.product.sku)));
  }

  toggleCompare() {
    this.store.dispatch(new ToggleCompare({ sku: this.product.sku }));
  }

  addToBasket(quantity: number) {
    this.store.dispatch(new AddProductToBasket({ sku: this.product.sku, quantity }));
  }
}
