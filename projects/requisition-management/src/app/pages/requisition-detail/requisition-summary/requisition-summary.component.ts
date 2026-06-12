import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';

import { Requisition, RequisitionViewer } from '../../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-summary',
  templateUrl: './requisition-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionSummaryComponent implements OnInit {
  @Input({ required: true }) requisition: Requisition;
  @Input() view: RequisitionViewer = 'buyer';

  costCenterName: string;
  customerApproverCount: number;
  uniqueApprovers: BasketApprover[];

  ngOnInit() {
    this.costCenterName = AttributeHelper.getAttributeValueByAttributeName(
      this.requisition?.attributes,
      'BusinessObjectAttributes#Order_CostCenter_Name'
    );

    if (this.requisition) {
      const rawApprovers =
        this.requisition.approval.statusCode === 'PENDING'
          ? this.requisition.approval.customerApproval.approvers || []
          : this.requisition.approval.approvers || [];

      this.uniqueApprovers = this.uniqueByEmail(rawApprovers);

      this.customerApproverCount = this.uniqueApprovers.length || 1;
    }
  }

  private uniqueByEmail(list: BasketApprover[]) {
    const uniqueEmails = new Set<string>();
    return list.filter(a => {
      if (uniqueEmails.has(a.email)) {
        return false;
      }
      uniqueEmails.add(a.email);
      return true;
    });
  }
}
