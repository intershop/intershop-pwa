import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { getCompareProductsSKUs } from '../../../../shopping/store/compare';

@Component({
  selector: 'ish-product-compare-status-container',
  templateUrl: './product-compare-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareStatusContainerComponent implements OnInit {
  productCompareCount$: Observable<number>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.productCompareCount$ = this.store.pipe(
      select(getCompareProductsSKUs),
      pluck('length')
    );
  }
}
