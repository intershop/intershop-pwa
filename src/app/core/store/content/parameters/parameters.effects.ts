import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, mergeMap } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import {
  loadParametersProductListFilter,
  loadParametersProductListFilterFail,
  loadParametersProductListFilterSuccess,
} from './parameters.actions';

@Injectable()
export class ParametersEffects {
  constructor(private actions$: Actions, private filterService: FilterService) {}

  loadParametersProductListFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadParametersProductListFilter),
      mapToPayload(),
      concatMap(({ id, searchParameter, amount }) =>
        this.filterService.getFilteredProducts(searchParameter, amount).pipe(
          mergeMap(({ products }) => [
            ...products.map((product: Product) => loadProductSuccess({ product })),
            loadParametersProductListFilterSuccess({ id, productList: products.map(p => p.sku) }),
          ]),
          mapErrorToAction(loadParametersProductListFilterFail)
        )
      )
    )
  );
}
