import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
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
  | 'approval';
@Component({
  selector: 'ish-requisitions-list',
  templateUrl: './requisitions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionsListComponent {
  /**
   * The requisitions to be listed
   */
  @Input() requisitions: Requisition[];
  @Input() status: RequisitionStatus = 'PENDING';
  @Input() columnsToDisplay: RequisitionColumnsType[];
  @ViewChild(RequisitionRejectDialogComponent) rejectDialog: RequisitionRejectDialogComponent;

  private selectedRequisitionId: string;

  constructor(private cdRef: ChangeDetectorRef, private requisitionContextFacade: RequisitionContextFacade) {}

  approveRequisition(requisitionNo: string) {
    const requisition = this.requisitions.find(r => r.requisitionNo === requisitionNo);

    if (!requisition) {
      return;
    }

    this.requisitionContextFacade.updateRequisitionStatusFromApprovalList$(requisition.id, 'APPROVED');
    this.cdRef.markForCheck();
  }

  openRejectDialog(requisitionNo: string) {
    const requisition = this.requisitions.find(r => r.requisitionNo === requisitionNo);

    if (requisition && this.rejectDialog) {
      this.selectedRequisitionId = requisition.id;
      this.rejectDialog.show();
    }
  }

  rejectRequisition(comment: string) {
    if (!this.selectedRequisitionId) {
      return;
    }

    this.requisitionContextFacade.updateRequisitionStatusFromApprovalList$(
      this.selectedRequisitionId,
      'REJECTED',
      comment
    );

    this.selectedRequisitionId = undefined;
    this.cdRef.markForCheck();
  }
}
