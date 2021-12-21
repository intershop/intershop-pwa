import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { CostCenter, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { CostCenterBuyerEditDialogComponent } from '../cost-center-buyer-edit-dialog/cost-center-buyer-edit-dialog.component';

type CostCenterBuyersListColumnsType = 'buyerName' | 'orders' | 'pendingOrders' | 'budget' | 'actions';

/**
 * The Cost Center User List Component displays the users assigned to the cost center, their budgets, orders and pending orders.
 *
 * @example
 * <ish-cost-center-users-list [costCenter]="costCenter"></ish-cost-center-users-list>
 */
@Component({
  selector: 'ish-cost-center-users-list',
  templateUrl: './cost-center-users-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterUsersListComponent implements OnInit {
  @Input() costCenter: CostCenter;
  @Input() isEditable = false;

  columnsToDisplay: CostCenterBuyersListColumnsType[] = ['buyerName', 'pendingOrders', 'orders', 'budget', 'actions'];

  selectedBuyer: CostCenterBuyer;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    if (!this.isEditable) {
      this.columnsToDisplay = this.columnsToDisplay.filter(col => col !== 'actions');
    }
  }

  openEditCostCenterBuyerDialog(buyer: CostCenterBuyer, modal: CostCenterBuyerEditDialogComponent) {
    modal.show(buyer);
  }

  removeBuyerConfirmation(buyer: CostCenterBuyer, modal: ModalDialogComponent<string>) {
    this.selectedBuyer = buyer;
    if (buyer.pendingOrders) {
      modal.show();
    } else {
      this.removeBuyerFromCostCenter();
    }
  }

  removeBuyerFromCostCenter() {
    this.organizationManagementFacade.removeBuyerFromCostCenter(this.selectedBuyer.login);
  }
}
