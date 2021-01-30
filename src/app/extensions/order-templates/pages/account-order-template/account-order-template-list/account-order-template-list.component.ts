import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplate } from '../../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-list',
  templateUrl: './account-order-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent {
  /**
   * The list of order templates of the customer.
   */
  @Input() orderTemplates: OrderTemplate[];
  /**
   * Emits the id of the order template, which is to be deleted.
   */
  @Output() deleteOrderTemplate = new EventEmitter<string>();

  constructor(private translate: TranslateService) {}

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.deleteOrderTemplate.emit(orderTemplateId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent<string>) {
    modal.options.titleText = this.translate.instant('account.order_templates.delete_dialog.header', {
      0: orderTemplate.title,
    });
    modal.show(orderTemplate.id);
  }

  getParts(tmpl: OrderTemplate): SkuQuantityType[] {
    return tmpl?.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }));
  }
}
