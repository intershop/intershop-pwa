import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';

type OrderTemplateColumnsType = 'actions' | 'creationDate' | 'lineItems' | 'title';

@Component({
  selector: 'ish-account-order-template-list',
  imports: [
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderCellDef,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CdkTable,
    DatePipe,
    ModalDialogComponent,
    ProductAddToBasketComponent,
    ProductContextDirective,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './account-order-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent {
  /**
   * The list of order templates of the customer.
   */
  @Input() orderTemplates: OrderTemplate[];
  @Input() columnsToDisplay: OrderTemplateColumnsType[] = ['title', 'creationDate', 'lineItems', 'actions'];

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private translate: TranslateService
  ) {}

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.orderTemplatesFacade.deleteOrderTemplate(orderTemplateId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent<string>) {
    modal.options.titleText = this.translate.instant('account.order_templates.delete_dialog.header', {
      0: orderTemplate.title,
    });
    modal.show(orderTemplate.id);
  }

  getParts(template: OrderTemplate): SkuQuantityType[] {
    return template?.items.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value }));
  }
}
