import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { AddProductToBasket } from '../../../checkout/store/basket';
import { RemoveFromCompare, getCompareProducts, getCompareProductsCount } from '../../store/compare';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageContainerComponent {
  compareProducts$ = this.store.pipe(select(getCompareProducts));
  compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));

  constructor(private store: Store<{}>) {}

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku, quantity }));
  }

  removeFromCompare(sku: string) {
    this.store.dispatch(new RemoveFromCompare(sku));
  }
}
