import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { RequisitionColumnsType } from '../../components/requisitions-list/requisitions-list.component';
import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition, RequisitionStatus } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-approver-page',
  templateUrl: './approver-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproverPageComponent implements OnInit {
  requisitions$: Observable<Requisition[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  status$: Observable<RequisitionStatus>;

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

  status: RequisitionStatus;
  columnsToDisplay: RequisitionColumnsType[];
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.requisitions$ = this.requisitionManagementFacade.requisitionsByRoute$;
    this.error$ = this.requisitionManagementFacade.requisitionsError$;
    this.loading$ = this.requisitionManagementFacade.requisitionsLoading$;
    this.status$ = this.requisitionManagementFacade.requisitionsStatus$ as Observable<RequisitionStatus>;

    this.status$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      this.status = status;
      switch (status) {
        case 'APPROVED':
          this.columnsToDisplay = [
            'requisitionNo',
            'orderNoSimple',
            'creationDate',
            'buyer',
            'approvalDate',
            'orderTotal',
          ];
          break;
        case 'REJECTED':
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
}
