import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';

import { Requisition, RequisitionViewer } from '../../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-summary',
  templateUrl: './requisition-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionSummaryComponent implements OnInit {
  @Input() requisition: Requisition;
  @Input() view: RequisitionViewer = 'buyer';

  costCenterName: string;
  customerApproverCount: number;

  ngOnInit() {
    this.costCenterName = AttributeHelper.getAttributeValueByAttributeName(
      this.requisition?.attributes,
      'BusinessObjectAttributes#Order_CostCenter_Name'
    );

    this.customerApproverCount = this.getCustomerApproverCount();
  }

  getCustomerApproverCount() {
    return this.requisition?.approval?.statusCode === 'PENDING'
      ? this.requisition?.approval?.customerApproval.approvers?.length || 1
      : this.requisition?.approval?.approvers?.length || 1;
  }
}
