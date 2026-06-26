import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';

type OrderTemplateColumnsType = 'actions' | 'creationDate' | 'lineItems' | 'title';

@Component({
  selector: 'ish-account-order-template-list',
  standalone: false,
  templateUrl: './account-order-template-list.component.html',
  styleUrls: ['./account-order-template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent {
  @Input() columnsToDisplay: OrderTemplateColumnsType[] = ['title', 'creationDate', 'lineItems', 'actions'];

  @Input() set orderTemplates(value: OrderTemplate[]) {
    if (this.orderTemplateList === value) {
      return;
    }
    this.orderTemplateList = value;
    this.orderTemplateList?.forEach(template => {
      if (template.items?.length === template.itemsCount) {
        this.loadedOrderTemplates.add(template.id);
      } else {
        this.orderTemplatesFacade.loadOrderTemplateDetails(template.id);
      }
    });
  }

  get orderTemplates(): OrderTemplate[] {
    return this.orderTemplateList;
  }

  private orderTemplateList: OrderTemplate[];
  private loadedOrderTemplates = new Set<string>();

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

  orderTemplateLoaded(orderTemplateId: string) {
    return this.loadedOrderTemplates.has(orderTemplateId);
  }

  getParts(template: OrderTemplate): SkuQuantityType[] {
    return template?.items?.map(item => ({ sku: item.sku, quantity: item.desiredQuantity.value })) ?? [];
  }
}
