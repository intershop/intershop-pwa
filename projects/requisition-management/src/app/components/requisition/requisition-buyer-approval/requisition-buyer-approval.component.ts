import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Requisition } from '../../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-buyer-approval',
  templateUrl: './requisition-buyer-approval.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionBuyerApprovalComponent {
  @Input() requisition: Requisition;
}
