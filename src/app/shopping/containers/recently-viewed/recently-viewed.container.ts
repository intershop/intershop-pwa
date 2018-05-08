import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../models/product/product.model';
import { getMostRecentlyViewedProducts } from '../../store/recently';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-recently-viewed-container',
  templateUrl: './recently-viewed.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedContainerComponent implements OnInit {
  recentlyProducts$: Observable<Product[]>;

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.recentlyProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));
  }
}
