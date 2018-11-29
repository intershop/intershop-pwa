import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { getUserAuthorized } from 'ish-core/store/user';
import { AddProductToQuoteRequest } from '../../../../store/quote-request';
import { ProductAddToQuoteDialogContainerComponent } from '../product-add-to-quote-dialog/product-add-to-quote-dialog.container';

/**
 * The Product Add To Quote Container Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-product-add-to-quote-container',
  templateUrl: './product-add-to-quote.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToQuoteContainerComponent {
  @Input()
  product: Product;
  @Input()
  disabled?: boolean;
  @Input()
  displayType?: string;
  @Input()
  cssClass?: string;
  @Input()
  quantity?: number;

  constructor(private ngbModal: NgbModal, private store: Store<{}>) {}

  addToQuote() {
    const { sku } = this.product;
    const quantity = this.quantity ? this.quantity : this.product.minOrderQuantity;
    this.store.dispatch(new AddProductToQuoteRequest({ sku, quantity }));
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
