import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'ish-requisition-detail-page',
  templateUrl: './requisition-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisitionDetailPageComponent implements OnInit, OnDestroy {
  requisition$: Observable<Requisition>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(private requisitionManagementFacade: RequisitionManagementFacade, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: { requisitionId: string }) => {
      this.requisition$ = this.requisitionManagementFacade.requisition$(params.requisitionId);
    });

    this.error$ = this.requisitionManagementFacade.requisitionsError$;
    this.loading$ = this.requisitionManagementFacade.requisitionsLoading$;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
