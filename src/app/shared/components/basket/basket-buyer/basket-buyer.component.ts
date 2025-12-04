import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Order } from 'ish-core/models/order/order.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconModule } from 'ish-core/icon.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ish-basket-buyer',
  templateUrl: './basket-buyer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, RouterLink, IconModule, TranslateModule],
})
export class BasketBuyerComponent implements OnInit {
  @Input({ required: true }) object: Basket | Order;
  /**
   * Router link for editing the order reference id. If a routerLink is given a link is displayed to route to an edit page.
   */
  @Input() editRouterLink: string;

  private customer$: Observable<Customer>;

  taxationID: string;
  companyName1: string;
  companyName2: string;

  private destroyRef = inject(DestroyRef);

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.taxationID = this.object.taxationId;

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

  get userName(): string {
    return this.object.user
      ? `${this.object.user?.firstName} ${this.object.user?.lastName}`
      : `${this.object.invoiceToAddress?.firstName} ${this.object.invoiceToAddress?.lastName}`;
  }
}
