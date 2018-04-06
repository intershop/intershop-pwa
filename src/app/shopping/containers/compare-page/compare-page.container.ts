import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { getCompareProductsByCurrentPageAndItemsPerPage, getCompareProductsCount, RemoveFromCompare } from '../../store/compare';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparePageContainerComponent implements OnInit {

  compareProducts$: Observable<Product[]>;
  compareProductsCount$: Observable<Number>;
  itemsPerPage = 3;

  constructor(
    private store: Store<ShoppingState>
  ) { }

  ngOnInit() {
    this.compareProducts$ = this.store.pipe(select(getCompareProductsByCurrentPageAndItemsPerPage(1, this.itemsPerPage)));
    this.compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));
  }

  onPageChanged(currentPage: number) {
    this.compareProducts$ = this.store.pipe(select(getCompareProductsByCurrentPageAndItemsPerPage(currentPage, this.itemsPerPage)));
  }

  addToCart({ sku, quantity }) {
    console.log('[ComparePageContainer] Add to Cart: SKU: ' + sku + ', Quantity: ' + quantity);
    // TODO: dispatch add to cart action // this.store.dispatch(new AddToCart(sku, quantity));
  }

  removeFromCompare(sku: string) {
    this.store.dispatch(new RemoveFromCompare(sku));
  }
}
