import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition, RequisitionStatus } from '../../models/requisition/requisition.model';
import { RequisitionRejectDialogComponent } from '../requisition-reject-dialog/requisition-reject-dialog.component';

export type RequisitionColumnsType =
  | 'requisitionNo'
  | 'orderNo'
  | 'orderNoSimple'
  | 'creationDate'
  | 'approver'
  | 'buyer'
  | 'approvalDate'
  | 'rejectionDate'
  | 'lineItems'
  | 'orderTotal'
  | 'actions';
@Component({
  selector: 'ish-requisitions-list',
  templateUrl: './requisitions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkTableModule,
    DatePipe,
    NgIf,
    PricePipe,
    RequisitionRejectDialogComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class RequisitionsListComponent {
  /**
   * The requisitions to be listed
   */
  @Input() requisitions: Requisition[];
  @Input() status: RequisitionStatus = 'PENDING';
  @Input() columnsToDisplay: RequisitionColumnsType[];

  @ViewChild('rejectDialog') rejectDialog: RequisitionRejectDialogComponent;

  private selectedRequisitionId: string;

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

  approveRequisition(requisitionId: string) {
    this.requisitionManagementFacade.updateRequisitionStatusFromList$(requisitionId, 'APPROVED');
  }

  openRejectDialog(requisitionId: string) {
    this.selectedRequisitionId = requisitionId;
    this.rejectDialog.show();
  }

  rejectRequisition(comment: string) {
    if (!this.selectedRequisitionId) {
      return;
    }
    this.requisitionManagementFacade.updateRequisitionStatusFromList$(this.selectedRequisitionId, 'REJECTED', comment);
    this.selectedRequisitionId = undefined;
  }
}
