import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

import { QuotingFacade } from '../../../facades/quoting.facade';
import { ProductAddToQuoteDialogComponent } from '../product-add-to-quote-dialog/product-add-to-quote-dialog.component';

/**
 * The Product Add To Quote Container Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-product-add-to-quote',
  templateUrl: './product-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductAddToQuoteComponent implements OnDestroy {
  @Input() product: Product;
  @Input() disabled?: boolean;
  @Input() displayType?: 'icon' | 'link' = 'link';
  @Input() class?: string;
  @Input() quantity?: number;

  private destroy$ = new Subject();

  constructor(private ngbModal: NgbModal, private quotingFacade: QuotingFacade, private accountFacade: AccountFacade) {}

  addToQuote() {
    const quantity = this.quantity ? this.quantity : this.product.minOrderQuantity;
    this.quotingFacade.addProductToQuoteRequest(this.product.sku, quantity);

    this.accountFacade.isLoggedIn$.pipe(take(1), whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.ngbModal.open(ProductAddToQuoteDialogComponent, { size: 'lg' });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
