import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Pagination } from '../../../models/pagination/pagination.interface';
import { Product } from '../../../models/product/product.model';
import { getCompareProductsByCurrentPageAndItemsPerPage, getCompareProductsCount } from '../../store/compare';
import * as fromCompare from '../../store/compare/compare.actions';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparePageContainerComponent implements OnInit {
  compareProducts$: Observable<Product[]>;
  compareProductsCount$: Observable<Number>;
  itemsPerPage = 2;
  constructor(
    private store: Store<ShoppingState>
  ) { }

  ngOnInit() {
    const initialPage = 1;
    this.compareProducts$ = this.store.pipe(select(getCompareProductsByCurrentPageAndItemsPerPage(initialPage, this.itemsPerPage)));
    this.compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));
  }

  onPageChanged(event: Pagination): void {
    this.compareProducts$ = this.store.pipe(select(getCompareProductsByCurrentPageAndItemsPerPage(event.currentPage, event.itemsPerPage)));
  }

  addToCart({ sku, quantity }) {
    console.log('[ComparePageContainer] Add to Cart: SKU: ' + sku + ', Quantity: ' + quantity);
    // TODO: dispatch add to cart action // this.store.dispatch(new AddToCart(sku, quantity));
  }

  removeProductCompare(sku: string) {
    this.store.dispatch(new fromCompare.RemoveFromCompare(sku));
  }
}
