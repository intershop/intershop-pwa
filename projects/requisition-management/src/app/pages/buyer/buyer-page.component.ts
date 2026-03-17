import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import {
  RequisitionColumnsType,
  RequisitionsListComponent,
} from '../../components/requisitions-list/requisitions-list.component';
import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition, RequisitionStatus } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-buyer-page',
  templateUrl: './buyer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorMessageComponent,
    LoadingComponent,
    NgbNavModule,
    RequisitionsListComponent,
    TranslatePipe,
    RouterLink],
})
export class BuyerPageComponent implements OnInit {
  requisitions$: Observable<Requisition[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  status$: Observable<RequisitionStatus>;

  status: RequisitionStatus;
  columnsToDisplay: RequisitionColumnsType[];
  private destroyRef = inject(DestroyRef);

  constructor(private requisitionManagementFacade: RequisitionManagementFacade) {}

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
            'orderNo',
            'creationDate',
            'approver',
            'approvalDate',
            'orderTotal'];
          break;
        case 'REJECTED':
          this.columnsToDisplay = [
            'requisitionNo',
            'creationDate',
            'approver',
            'rejectionDate',
            'lineItems',
            'orderTotal'];
          break;
        default:
          this.columnsToDisplay = ['requisitionNo', 'creationDate', 'lineItems', 'orderTotal'];
          break;
      }
    });
  }
}
