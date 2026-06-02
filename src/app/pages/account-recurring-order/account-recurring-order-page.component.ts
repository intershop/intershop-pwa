import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, first } from 'rxjs';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { whenTruthy } from 'ish-core/utils/operators';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostCenterViewComponent } from 'ish-shared/components/basket/basket-cost-center-view/basket-cost-center-view.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { SwitchComponent } from 'ish-shared/components/common/switch/switch.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

@Component({
  selector: 'ish-account-recurring-order-page',
  templateUrl: './account-recurring-order-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AddressComponent,
    AsyncPipe,
    BasketCostCenterViewComponent,
    BasketCostSummaryComponent,
    BasketCustomFieldsViewComponent,
    BasketShippingMethodComponent,
    DatePipe,
    FeatureToggleDirective,
    InfoBoxComponent,
    LineItemListComponent,
    OrderRecurrenceComponent,
    RouterLink,
    ServerHtmlDirective,
    SwitchComponent,
    TranslatePipe,
  ],
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
