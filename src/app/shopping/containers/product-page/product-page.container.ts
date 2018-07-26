import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AddProductToBasket } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { CoreState } from '../../../core/store/core.state';
import { getUserAuthorized } from '../../../core/store/user';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';
import { ProductAddToQuoteDialogContainerComponent } from '../../../quoting/containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';
import { AddProductToQuoteRequest } from '../../../quoting/store/quote-request';
import { QuotingState } from '../../../quoting/store/quoting.state';
import { getSelectedCategory } from '../../store/categories';
import { AddToCompare } from '../../store/compare';
import { getProductLoading, getSelectedProduct } from '../../store/products';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent implements OnInit {
  product$: Observable<Product>;
  productLoading$: Observable<boolean>;
  category$: Observable<CategoryView>;

  constructor(
    private bsModalService: BsModalService,
    private store: Store<CoreState | ShoppingState | CheckoutState | QuotingState>
  ) {}

  ngOnInit() {
    this.product$ = this.store.pipe(
      select(getSelectedProduct),
      filter(product => !!product)
    );
    this.category$ = this.store.pipe(
      select(getSelectedCategory),
      filter(category => !!category)
    );
    this.productLoading$ = this.store.pipe(select(getProductLoading));
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku: sku, quantity: quantity }));
  }

  addToCompare(sku) {
    this.store.dispatch(new AddToCompare(sku));
  }

  addToQuote({ sku, quantity }) {
    this.store.dispatch(new AddProductToQuoteRequest({ sku: sku, quantity: quantity }));
    this.store
      .pipe(
        select(getUserAuthorized),
        take(1),
        filter(b => b)
      )
      .subscribe(() => {
        this.bsModalService.show(ProductAddToQuoteDialogContainerComponent);
      });
  }
}
