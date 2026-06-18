import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrderTemplatesFacade } from '../../../facades/order-templates.facade';
import { OrderTemplate } from '../../../models/order-template/order-template.model';
import { OrderTemplateAddToCartDialogComponent } from '../../../shared/order-template-add-to-cart/order-template-add-to-cart-dialog/order-template-add-to-cart-dialog.component';

type OrderTemplateColumnsType = 'actions' | 'creationDate' | 'lineItems' | 'title';

@Component({
  selector: 'ish-account-order-template-list',
  standalone: false,
  templateUrl: './account-order-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateListComponent {
  /**
   * The list of order templates of the customer.
   */
  @Input() orderTemplates: OrderTemplate[];
  @Input() columnsToDisplay: OrderTemplateColumnsType[] = ['title', 'creationDate', 'lineItems', 'actions'];

  /**
   * Holds the ID of the order template currently being added to cart
   */
  loadingOrderTemplateId$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private orderTemplatesFacade: OrderTemplatesFacade,
    private translate: TranslateService
  ) {}

  /** Emits the id of the order template to delete. */
  delete(orderTemplateId: string) {
    this.orderTemplatesFacade.deleteOrderTemplate(orderTemplateId);
  }

  openModal(modal: OrderTemplateAddToCartDialogComponent) {
    modal.show();
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(orderTemplate: OrderTemplate, modal: ModalDialogComponent<string>) {
    modal.options.titleText = this.translate.instant('account.order_templates.delete_dialog.header', {
      0: orderTemplate.title,
    });
    modal.show(orderTemplate.id);
  }

  loadOrderTemplateDetails(orderTemplateId: string) {
    this.orderTemplatesFacade.loadOrderTemplateDetails(orderTemplateId);
  }
}
