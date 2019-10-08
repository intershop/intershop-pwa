import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { QuotingFacade } from '../../../../facades/quoting.facade';
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
  @Input() product: Product;
  @Input() disabled?: boolean;
  @Input() displayType?: string;
  @Input() class?: string;
  @Input() quantity?: number;

  constructor(private ngbModal: NgbModal, private quotingFacade: QuotingFacade, private accountFacade: AccountFacade) {}

  addToQuote() {
    const quantity = this.quantity ? this.quantity : this.product.minOrderQuantity;
    this.quotingFacade.addProductToQuoteRequest(this.product.sku, quantity);

    this.accountFacade.isLoggedIn$
      .pipe(
        take(1),
        whenTruthy()
      )
      .subscribe(() => {
        this.ngbModal.open(ProductAddToQuoteDialogContainerComponent, { size: 'lg' });
      });
  }
}
