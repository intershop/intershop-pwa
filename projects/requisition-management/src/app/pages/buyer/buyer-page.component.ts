import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-buyer-page',
  templateUrl: './buyer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerPageComponent implements OnInit {
  requisitions$: Observable<Requisition[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

  ngOnInit() {
    this.requisitions$ = this.requisitionManagementFacade.requisitions$();
    this.error$ = this.requisitionManagementFacade.requisitionsError$;
    this.loading$ = this.requisitionManagementFacade.requisitionsLoading$;
  }
}
