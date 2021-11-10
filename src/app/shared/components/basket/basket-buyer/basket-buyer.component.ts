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
  /**
   * Router link for editing the order reference id. If a routerLink is given a link is displayed to route to an edit page.
   */
  @Input() editRouterLink?: string;

  customer$: Observable<Customer>;
  user$: Observable<User>;

  taxationID: string;
  orderReferenceID: string;
  costCenterName: string;
  userName: string;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.taxationID = this.getAttributeValue('taxationID');
    this.orderReferenceID = this.getAttributeValue('orderReferenceID');
    this.costCenterName = this.getAttributeValue('BusinessObjectAttributes#Order_CostCenter_Name');

    // default values for anonymous users
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

  private getAttributeValue(attributeName: string): string {
    return this.object.attributes?.find(attr => attr.name === attributeName)?.value as string;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
