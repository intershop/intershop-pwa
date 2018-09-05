import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { AddProductToBasket } from '../../../checkout/store/basket';
import { getUserAuthorized } from '../../../core/store/user';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { ProductAddToQuoteDialogContainerComponent } from '../../../quoting/containers/product-add-to-quote-dialog/product-add-to-quote-dialog.container';
import { AddProductToQuoteRequest } from '../../../quoting/store/quote-request';

@Component({
  selector: 'ish-product-row-container',
  templateUrl: './product-row.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowContainerComponent {
  @Input()
  product: Product;
  @Input()
  category?: Category;

  constructor(private ngbModal: NgbModal, private store: Store<{}>) {}

  addToBasket() {
    this.store.dispatch(new AddProductToBasket({ sku: this.product.sku, quantity: this.product.minOrderQuantity }));
  }

  addToQuote() {
    this.store.dispatch(
      new AddProductToQuoteRequest({ sku: this.product.sku, quantity: this.product.minOrderQuantity })
    );
    this.store
      .pipe(
        select(getUserAuthorized),
        take(1),
        filter(b => b)
      )
      .subscribe(() => {
        this.ngbModal.open(ProductAddToQuoteDialogContainerComponent, { size: 'lg' });
      });
  }
}
