import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-detail-page',
  templateUrl: './requisition-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequisitionContextFacade],
})
export class RequisitionDetailPageComponent implements OnInit {
  requisition$: Observable<Requisition>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  view$: Observable<'buyer' | 'approver'>;

  constructor(private context: RequisitionContextFacade) {}

  ngOnInit() {
    this.requisition$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.error$ = this.context.select('error');
    this.view$ = this.context.select('view');
  }

  approveRequisition() {
    this.context.approveRequisition$();
  }

  rejectRequisition(comment: string) {
    this.context.rejectRequisition$(comment);
    return false;
  }
}
