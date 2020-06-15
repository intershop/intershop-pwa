import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';

import { ProductHelper } from 'ish-core/models/product/product.model';
import { getSelectedProduct } from 'ish-core/store/shopping/products/products.selectors';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { AddToRecently } from './recently.actions';

@Injectable()
export class RecentlyEffects {
  constructor(private store: Store, private featureToggleService: FeatureToggleService) {}

  @Effect()
  viewedProduct$ = this.store.pipe(
    select(getSelectedProduct),
    whenTruthy(),
    filter(p => !ProductHelper.isFailedLoading(p)),
    distinctUntilKeyChanged('sku'),
    filter(
      product =>
        this.featureToggleService.enabled('advancedVariationHandling') || !ProductHelper.isMasterProduct(product)
    ),
    map(product => ({
      sku: product.sku,
      group: (ProductHelper.isVariationProduct(product) && product.productMasterSKU) || undefined,
    })),
    map(({ sku, group }) => new AddToRecently({ sku, group }))
  );
}
