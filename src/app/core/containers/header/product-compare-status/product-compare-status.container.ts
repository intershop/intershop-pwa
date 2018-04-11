import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { pluck } from 'rxjs/operators';
import { getCompareProductsSKUs } from '../../../../shopping/store/compare';
import { ShoppingState } from '../../../../shopping/store/shopping.state';

@Component({
  selector: 'ish-product-compare-status-container',
  templateUrl: './product-compare-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareStatusContainerComponent implements OnInit {
  productCompareCount$: Observable<number>;

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.productCompareCount$ = this.store.pipe(select(getCompareProductsSKUs), pluck('length'));
  }
}
