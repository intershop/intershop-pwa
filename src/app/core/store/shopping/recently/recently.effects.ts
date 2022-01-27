import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { distinctUntilKeyChanged, filter, map, withLatestFrom } from 'rxjs/operators';

import { ProductHelper } from 'ish-core/models/product/product.model';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { getSelectedProduct } from 'ish-core/store/shopping/products/products.selectors';
import { whenTruthy } from 'ish-core/utils/operators';

import { addToRecently } from './recently.actions';

@Injectable()
export class RecentlyEffects {
  constructor(private store: Store) {}

  viewedProduct$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedProduct),
      whenTruthy(),
      filter(p => !ProductHelper.isFailedLoading(p)),
      distinctUntilKeyChanged('sku'),
      withLatestFrom(
        this.store.pipe(
          select(getServerConfigParameter<boolean>('preferences.ChannelPreferences.EnableAdvancedVariationHandling'))
        )
      ),
      filter(
        ([product, advancedVariationHandling]) => advancedVariationHandling || !ProductHelper.isMasterProduct(product)
      ),
      map(([product]) => ({
        sku: product.sku,
        group: (ProductHelper.isVariationProduct(product) && product.productMasterSKU) || undefined,
      })),
      map(({ sku, group }) => addToRecently({ sku, group }))
    )
  );
}
