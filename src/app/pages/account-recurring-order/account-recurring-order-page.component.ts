import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, first } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-account-recurring-order-page',
  templateUrl: './account-recurring-order-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRecurringOrderPageComponent implements OnInit {
  recurringOrder$: Observable<RecurringOrder>;
  private recurringOrder: RecurringOrder;
  taxationID: string;
  showErrorCode = false;

  private destroyRef = inject(DestroyRef);

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.recurringOrder$ = this.accountFacade.selectedRecurringOrder$;
    this.recurringOrder$.pipe(whenTruthy(), first(), takeUntilDestroyed(this.destroyRef)).subscribe(recurringOrder => {
      this.recurringOrder = recurringOrder;
    });

    this.accountFacade.customer$
      .pipe(whenTruthy(), first(), takeUntilDestroyed(this.destroyRef))
      .subscribe(customer => {
        this.taxationID = this.taxationID || customer?.taxationID;
      });
  }

  switchActiveStatus(switchStatus: { active: boolean }) {
    this.accountFacade.setActiveRecurringOrder(this.recurringOrder.id, switchStatus.active);
  }

  // callback function for ishServerHtml link
  get activateRecurringOrder() {
    return () => {
      this.accountFacade.setActiveRecurringOrder(this.recurringOrder.id, true);
    };
  }

  toggleShowErrorCode() {
    this.showErrorCode = !this.showErrorCode;
  }
}
