import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

type CostCenterColumnsType = 'costCenterId' | 'costCenterName' | 'costCenterManager' | 'costCenterBudget' | 'actions';

@Component({
  selector: 'ish-cost-centers-page',
  templateUrl: './cost-centers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCentersPageComponent implements OnInit {
  costCenters$: Observable<CostCenter[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  columnsToDisplay: CostCenterColumnsType[] = [
    'costCenterId',
    'costCenterName',
    'costCenterManager',
    'costCenterBudget',
    'actions',
  ];

  /**
   * keep cost center for usage in confirmation dialogs (delete/deactivate)
   */
  selectedCostCenter: CostCenter;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.costCenters$ = this.organizationManagementFacade.costCenters$;
    this.error$ = this.organizationManagementFacade.costCentersError$;
    this.loading$ = this.organizationManagementFacade.costCentersLoading$;
  }

  openConfirmationDialog(costCenter: CostCenter, modal: ModalDialogComponent<string>) {
    this.selectedCostCenter = costCenter;
    modal.show();
  }

  /** Deletes the cost center */
  delete() {
    this.organizationManagementFacade.deleteCostCenter(this.selectedCostCenter.id);
  }

  deactivate() {
    this.organizationManagementFacade.updateCostCenter({ ...this.selectedCostCenter, active: false });
  }

  activate(costCenter: CostCenter) {
    this.organizationManagementFacade.updateCostCenter({ ...costCenter, active: true });
  }

  isDeletable(costCenter: CostCenter): Observable<boolean> {
    return this.organizationManagementFacade.isCostCenterEditable(of(costCenter));
  }
}
