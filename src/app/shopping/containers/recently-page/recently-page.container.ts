import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { Product } from '../../../models/product/product.model';
import { ClearRecently, getRecentlyViewedProducts } from '../../store/recently';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-recently-page-container',
  templateUrl: './recently-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageContainerComponent implements OnInit {
  products$: Observable<Product[]> = of([]);

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.products$ = this.store.pipe(select(getRecentlyViewedProducts));
  }

  clearAll() {
    this.store.dispatch(new ClearRecently());
  }
}
