import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';
import { getSelectedProduct } from '../products/products.selectors';
import { ShoppingState } from '../shopping.state';
import * as recentlyActions from './recently.actions';

@Injectable()
export class RecentlyEffects {
  constructor(private store: Store<ShoppingState>) {}

  @Effect()
  viewedProduct$ = this.store.pipe(
    select(getSelectedProduct),
    filter(product => !!product),
    distinctUntilKeyChanged('sku'),
    map(product => new recentlyActions.AddToRecently(product.sku))
  );
}
