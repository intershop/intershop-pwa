import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Order } from 'ish-core/models/order/order.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-basket-buyer',
  templateUrl: './basket-buyer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketBuyerComponent implements OnInit {
  @Input() object: Basket | Order;
  /**
   * Router link for editing the order reference id. If a routerLink is given a link is displayed to route to an edit page.
   */
  @Input() editRouterLink: string;

  customer$: Observable<Customer>;

  taxationID: string;
  costCenterName: string;
  userName: string;
  companyName1: string;
  companyName2: string;

  private destroyRef = inject(DestroyRef);

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.taxationID = this.object.taxationId;
    this.costCenterName = this.getAttributeValue('BusinessObjectAttributes#Order_CostCenter_Name');

    this.userName = this.object.user
      ? `${this.object.user?.firstName} ${this.object.user?.lastName}`
      : `${this.object.invoiceToAddress?.firstName} ${this.object.invoiceToAddress?.lastName}`;

    this.companyName1 = this.object.user?.companyName || this.object.invoiceToAddress?.companyName1 || '';
    this.companyName2 =
      (this.object.user?.companyName ? this.object.user?.companyName2 : this.object.invoiceToAddress?.companyName2) ||
      '';

    this.customer$ = this.accountFacade.customer$;

    // values for registered users and basket
    this.customer$.pipe(whenTruthy(), first(), takeUntilDestroyed(this.destroyRef)).subscribe(customer => {
      this.taxationID = this.taxationID || customer?.taxationID;
    });
  }

  private getAttributeValue(attributeName: string): string {
    return this.object.attributes?.find(attr => attr.name === attributeName)?.value as string;
  }
}
