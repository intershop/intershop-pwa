import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-approver-page',
  templateUrl: './approver-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverPageComponent implements OnInit, OnDestroy {
  requisitions$: Observable<Requisition[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  status$: Observable<string>;

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

  status: string;
  columnsToDisplay: string[];
  private destroy$ = new Subject();

  ngOnInit() {
    this.requisitions$ = this.requisitionManagementFacade.requisitions$;
    this.error$ = this.requisitionManagementFacade.requisitionsError$;
    this.loading$ = this.requisitionManagementFacade.requisitionsLoading$;
    this.status$ = this.requisitionManagementFacade.requisitionsStatus$;

    this.status$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.status = status;
      switch (status) {
        case 'approved':
          this.columnsToDisplay = ['requisitionNo', 'orderNo', 'creationDate', 'buyer', 'approvalDate', 'orderTotal'];
          break;
        case 'rejected':
          this.columnsToDisplay = [
            'requisitionNo',
            'creationDate',
            'buyer',
            'rejectionDate',
            'lineItems',
            'orderTotal',
          ];
          break;
        default:
          this.columnsToDisplay = ['requisitionNo', 'creationDate', 'buyer', 'lineItems', 'orderTotal'];
          break;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
