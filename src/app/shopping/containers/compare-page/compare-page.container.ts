import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AddProductToBasket } from '../../../checkout/store/basket';
import { Product } from '../../../models/product/product.model';
import { RemoveFromCompare, getCompareProducts, getCompareProductsCount } from '../../store/compare';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageContainerComponent implements OnInit {
  compareProducts$: Observable<Product[]>;
  compareProductsCount$: Observable<number>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.compareProducts$ = this.store.pipe(select(getCompareProducts));
    this.compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku: sku, quantity: quantity }));
  }

  removeFromCompare(sku: string) {
    this.store.dispatch(new RemoveFromCompare(sku));
  }
}
