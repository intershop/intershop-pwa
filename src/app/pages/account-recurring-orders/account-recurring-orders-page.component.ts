import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';

import { RecurringOrderColumnsType } from './recurring-order-list/recurring-order-list.component';

@Component({
  selector: 'ish-account-recurring-orders-page',
  templateUrl: './account-recurring-orders-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRecurringOrdersPageComponent implements OnInit {
  recurringOrders$: Observable<RecurringOrder[]>;
  recurringOrdersLoading$: Observable<boolean>;
  recurringOrdersError$: Observable<HttpError>;
  columnsToDisplay: RecurringOrderColumnsType[];
  context: string;

  private destroyRef = inject(DestroyRef);

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.recurringOrders$ = this.accountFacade.recurringOrders$();
    this.recurringOrdersLoading$ = this.accountFacade.recurringOrdersLoading$;
    this.recurringOrdersError$ = this.accountFacade.recurringOrdersError$;

    this.accountFacade.recurringOrdersContext$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(context => {
      this.context = context || 'MY';
      context === 'ADMIN'
        ? (this.columnsToDisplay = [
            'recurringOrderNo',
            'frequency',
            'lastOrderDate',
            'nextOrderDate',
            'buyer',
            'orderTotal',
            'actions',
          ])
        : (this.columnsToDisplay = [
            'recurringOrderNo',
            'creationDate',
            'frequency',
            'lastOrderDate',
            'nextOrderDate',
            'orderTotal',
            'actions',
          ]);
    });
  }
}
