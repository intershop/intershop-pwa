import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import * as productsSelectors from '../products/products.selectors';
import { ShoppingState } from '../shopping.state';
import * as recentlyActions from './recently.actions';

@Injectable()
export class RecentlyEffects {
  constructor(
    private store: Store<ShoppingState>,
  ) { }

  @Effect()
  viewedProduct$ = this.store.pipe(
    select(productsSelectors.getSelectedProductId),
    filter(id => !!id),
    map(id => new recentlyActions.AddToRecently(id))
  );
}
