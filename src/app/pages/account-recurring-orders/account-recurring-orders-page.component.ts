import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import {
  RecurringOrderColumnsType,
  RecurringOrderListComponent,
} from './recurring-order-list/recurring-order-list.component';

@Component({
  selector: 'ish-account-recurring-orders-page',
  templateUrl: './account-recurring-orders-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    AuthorizationToggleDirective,
    ErrorMessageComponent,
    LoadingComponent,
    NgbNavModule,
    RecurringOrderListComponent,
    RouterLink,
    TranslatePipe,
  ],
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
