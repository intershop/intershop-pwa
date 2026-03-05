import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { NotRoleToggleDirective } from 'ish-core/directives/not-role-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CostCenter, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
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
  standalone: true,
  imports: [
    AuthorizationToggleDirective,
    CdkTableModule,
    CostCenterBuyerEditDialogComponent,
    ModalDialogComponent,
    NgIf,
    NotRoleToggleDirective,
    PricePipe,
    ServerHtmlDirective,
    TranslatePipe,
    RouterLink,
  ],
})
export class CostCenterUsersListComponent implements OnInit {
  @Input({ required: true }) costCenter: CostCenter;
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
