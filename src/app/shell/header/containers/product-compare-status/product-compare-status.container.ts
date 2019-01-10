import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCompareProductsSKUs } from 'ish-core/store/shopping/compare';
import { mapToProperty } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-compare-status-container',
  templateUrl: './product-compare-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareStatusContainerComponent {
  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';

  productCompareCount$ = this.store.pipe(
    select(getCompareProductsSKUs),
    mapToProperty('length')
  );

  constructor(private store: Store<{}>) {}
}
