import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Requisition, RequisitionViewer } from '../../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-summary',
  templateUrl: './requisition-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionSummaryComponent {
  @Input() requisition: Requisition;
  @Input() view: RequisitionViewer = 'buyer';
}
