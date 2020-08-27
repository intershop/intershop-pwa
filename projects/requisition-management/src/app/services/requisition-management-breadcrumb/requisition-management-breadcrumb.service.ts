import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { selectRouteParam } from 'ish-core/store/core/router';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';

@Injectable({ providedIn: 'root' })
export class RequisitionManagementBreadcrumbService {
  constructor(
    private appFacade: AppFacade,
    private store: Store,
    private requisitionManagementFacade: RequisitionManagementFacade,
    private translateService: TranslateService
  ) {}

  breadcrumb$(prefix: string): Observable<BreadcrumbItem[]> {
    return this.appFacade.routingInProgress$.pipe(
      whenFalsy(),
      withLatestFrom(this.appFacade.path$.pipe(whenTruthy())),
      switchMap(([, path]) => {
        if (path.endsWith('/buyer')) {
          return of([{ key: 'account.requisitions.requisitions' }]);
        }
        if (path.endsWith('/approver')) {
          return of([{ key: 'account.requisitions.approvals' }]);
        }
        if (path.includes('/approver/') || path.includes('/buyer/')) {
          return this.requisitionManagementFacade.selectedRequisition$.pipe(
            whenTruthy(),
            withLatestFrom(
              this.translateService.get('approval.details.breadcrumb.order.label'),
              this.store.pipe(select(selectRouteParam('status')))
            ),
            map(([req, translation, status]) =>
              path.includes('/approver/')
                ? [
                    {
                      key: 'account.requisitions.approvals',
                      link: [prefix + '/approver', { status }],
                    },
                    {
                      text: `${translation} - ${req.requisitionNo}`,
                    },
                  ]
                : [
                    {
                      key: 'account.requisitions.requisitions',
                      link: [prefix + '/buyer', { status }],
                    },
                    {
                      text: `${translation} - ${req.requisitionNo}`,
                    },
                  ]
            )
          );
        }
        return EMPTY;
      })
    );
  }
}
