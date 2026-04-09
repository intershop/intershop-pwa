import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostCenterViewComponent } from 'ish-shared/components/basket/basket-cost-center-view/basket-cost-center-view.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

@Component({
  selector: 'ish-checkout-receipt',
  templateUrl: './checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    BasketMerchantMessageViewComponent,
    ServerSettingPipe,
    FeatureToggleDirective,
    InfoBoxComponent,
    BasketBuyerComponent,
    OrderRecurrenceComponent,
    BasketShippingMethodComponent,
    AddressComponent,
    SkipContentLinkComponent,
    LineItemListComponent,
    TranslatePipe,
    BasketCostSummaryComponent,
    BasketCostCenterViewComponent,
    BasketCustomFieldsViewComponent,
  ],
})
export class CheckoutReceiptComponent {
  @Input({ required: true }) order: Order | RecurringOrder | Basket;

  hasCustomFields(): boolean {
    return this.order?.customFields && Object.keys(this.order.customFields).length > 0;
  }
}
