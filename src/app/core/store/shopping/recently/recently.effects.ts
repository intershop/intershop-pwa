import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { ProductsActionTypes, SelectProduct } from '../products';
import { getSelectedProduct } from '../products/products.selectors';

import * as recentlyActions from './recently.actions';

@Injectable()
export class RecentlyEffects {
  constructor(private actions: Actions, private store: Store<{}>) {}

  @Effect()
  viewedProduct$ = combineLatest([
    this.actions.pipe(
      ofType<SelectProduct>(ProductsActionTypes.SelectProduct),
      mapToPayloadProperty('sku'),
      whenTruthy()
    ),
    this.store.pipe(
      select(getSelectedProduct),
      whenTruthy()
    ),
  ]).pipe(
    filter(([sku, product]) => sku === product.sku),
    map(([, product]) => product.sku),
    distinctUntilChanged(),
    map(sku => new recentlyActions.AddToRecently({ sku }))
  );
}
