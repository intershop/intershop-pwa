import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Product } from '../../../models/product/product.model';
import * as fromStore from '../../store/recently';

@Component({
  selector: 'ish-recently-page-container',
  templateUrl: './recently-page.container.html'
})

export class RecentlyPageContainerComponent implements OnInit {

  products$: Observable<Product[]> = of([]);

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  ngOnInit() {
    this.products$ = this.store.pipe(select(fromStore.getRecentlyViewedProducts));
  }

}
