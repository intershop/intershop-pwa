import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class RequisitionManagementBreadcrumbService {
  constructor(private appFacade: AppFacade) {}

  breadcrumb$(prefix: string): Observable<BreadcrumbItem[]> {
    return this.appFacade.routingInProgress$.pipe(
      whenFalsy(),
      withLatestFrom(this.appFacade.path$.pipe(whenTruthy())),
      switchMap(([, path]) => {
        if (path.includes('/buyer/')) {
          return of([{ key: 'account.requisitions.requisitions' }]);
        } else if (path.includes('/approver/')) {
          return of([{ key: 'account.requisitions.approvals' }]);
        }
        // tslint:disable-next-line: no-console
        console.log(prefix);
        return EMPTY;
      })
    );
  }
}
