import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

export type RecurringOrderColumnsType =
  | 'recurringOrderNo'
  | 'creationDate'
  | 'frequency'
  | 'lastOrderDate'
  | 'nextOrderDate'
  | 'buyer'
  | 'orderTotal'
  | 'actions';

@Component({
  selector: 'ish-recurring-order-list',
  templateUrl: './recurring-order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecurringOrderListComponent {
  @Input() recurringOrders: RecurringOrder[];
  @Input() columnsToDisplay: RecurringOrderColumnsType[];
  @Input() context: string;

  constructor(private accountFacade: AccountFacade, private translate: TranslateService) {}

  /** Emits the id of the recurring order to delete. */
  delete(recurringOrderId: string) {
    this.accountFacade.deleteRecurringOrder(recurringOrderId);
  }

  /** Emits id and active state to update the active state for the recurring order */
  switchActiveStatus(recurringOrder: { active: boolean; id: string }) {
    this.accountFacade.setActiveRecurringOrder(recurringOrder.id, recurringOrder.active);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(recurringOrder: RecurringOrder, modal: ModalDialogComponent<string>) {
    modal.options.titleText = this.translate.instant('account.recurring_order.delete_dialog.header', {
      0: recurringOrder.documentNo,
    });
    modal.show(recurringOrder.id);
  }
}
