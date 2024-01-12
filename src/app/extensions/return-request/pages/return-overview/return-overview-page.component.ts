import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, of, switchMap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ReturnRequestFacade } from '../../facades/return-request.facade';
import { ReturnRequest, ReturnRequestStatus } from '../../models/return-request/return-request.model';

type TabName = 'all' | 'requested' | 'confirmed' | 'completed';

@Component({
  selector: 'ish-return-overview-page',
  templateUrl: './return-overview-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnOverviewPageComponent implements OnInit {
  currentYear = new Date().getFullYear();
  active: TabName = 'all';
  ordersId$: Observable<string[]>;
  returnRequests: ReturnRequest[];
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  private destroyRef = inject(DestroyRef);

  constructor(private accountFacade: AccountFacade, private returnRequestFacade: ReturnRequestFacade) {}

  ngOnInit() {
    this.loading$ = this.returnRequestFacade.returnRequestLoading$;
    this.error$ = this.returnRequestFacade.returnRequestError$;

    this.accountFacade
      .orders$()
      .pipe(
        map(orders => orders.filter(order => order.statusCode === 'EXPORTED').map(order => order.id)),
        switchMap(ids => (ids.length ? this.returnRequestFacade.getOrderReturnRequests$(ids) : of(undefined))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        if (data) {
          this.returnRequests = data;
        }
      });
  }

  getLast3Year(): number[] {
    const currentYear = new Date().getFullYear();
    return Array(3)
      .fill('')
      .map((_, index) => currentYear - (index + 1));
  }

  getOrders(status?: ReturnRequestStatus) {
    return this.returnRequests.filter(request => !status || request.status === status);
  }
}
