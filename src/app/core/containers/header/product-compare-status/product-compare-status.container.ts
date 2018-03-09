import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { pluck } from 'rxjs/operators';
import { getCompareProductsSKUs, ShoppingState } from '../../../../shopping/store/compare';

@Component({
  selector: 'ish-product-compare-status-container',
  templateUrl: './product-compare-status.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareStatusContainerComponent implements OnInit {

  productCompareCount$: Observable<number>;

  constructor(
    private store: Store<ShoppingState>,
  ) { }

  ngOnInit(): void {
    this.productCompareCount$ = this.store.pipe(select(getCompareProductsSKUs), pluck('length'));
  }
}
