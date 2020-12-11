import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-basket-buyer',
  templateUrl: './basket-buyer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketBuyerComponent implements OnInit, OnDestroy {
  @Input() object: Basket | Order;

  customer$: Observable<Customer>;
  user$: Observable<User>;

  taxationID: string;
  userName: string;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    // default values for anonymous users
    this.taxationID = this.object.attributes?.find(attr => attr.name === 'taxationID')?.value as string;
    this.userName = `${this.object.invoiceToAddress?.firstName} ${this.object.invoiceToAddress?.lastName}`;

    this.customer$ = this.accountFacade.customer$;
    this.user$ = this.accountFacade.user$;

    // values for registered users
    this.customer$.pipe(whenTruthy(), first(), takeUntil(this.destroy$)).subscribe(customer => {
      this.taxationID = customer?.taxationID;
    });

    this.user$.pipe(whenTruthy(), first(), takeUntil(this.destroy$)).subscribe(user => {
      this.userName = `${user.firstName} ${user.lastName}`;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
