import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplate } from '../../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-list',
  templateUrl: './account-order-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent implements OnDestroy {
  /**
   * The list of order templates of the customer.
   */
  @Input() orderTemplates: OrderTemplate[];
  /**
   * Emits the id of the order template, which is to be deleted.
   */
  @Output() deleteOrderTemplate = new EventEmitter<string>();

  dummyProduct = { sku: 'dummy', available: true };

  private destroy$ = new Subject();

  constructor(private translate: TranslateService, private productFacade: ShoppingFacade) {}

  addTemplateToCart(orderTemplateId: string) {
    const products = this.orderTemplates.find(t => t.id === orderTemplateId).items
      ? this.orderTemplates.find(t => t.id === orderTemplateId).items
      : [];

    if (products.length > 0) {
      products.forEach(product => {
        this.productFacade.addProductToBasket(product.sku, product.desiredQuantity.value);
      });
    }
  }

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.deleteOrderTemplate.emit(orderTemplateId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent<string>) {
    this.translate
      .get('account.order_templates.delete_dialog.header', { 0: orderTemplate.title })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(res => (modal.options.titleText = res));

    modal.show(orderTemplate.id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
