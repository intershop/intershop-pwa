import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pluck } from 'rxjs/operators';

import { getCompareProductsSKUs } from '../../../../shopping/store/compare';

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
    pluck('length')
  );

  constructor(private store: Store<{}>) {}
}
