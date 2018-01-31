import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import * as fromStore from '../../store';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html'
})

export class ProductPageComponent implements OnInit {

  product$: Observable<Product>;
  category$: Observable<Category>;
  categoryPath: Category[] = [];

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  ngOnInit() {
    // TODO: find a nicer way to filter out the case of an 'undefined' product when the router state change is not waiting for the guard to actually do the routing
    this.product$ = this.store.select(fromStore.getSelectedProduct).pipe(
      filter(product => !!product)
    );

    // TODO: find a nicer way to filter out the case of an 'undefined' category when the router state change is not waiting for the guard to actually do the routing
    this.category$ = this.store.select(fromStore.getSelectedCategory).pipe(
      filter(category => !!category)
    );
  }

}
