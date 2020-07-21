import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Requisition } from '../../models/requisition/requisition.model';

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
}
