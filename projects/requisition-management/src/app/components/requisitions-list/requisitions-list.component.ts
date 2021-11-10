import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Requisition, RequisitionStatus } from '../../models/requisition/requisition.model';

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
  | 'orderTotal';

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
}
