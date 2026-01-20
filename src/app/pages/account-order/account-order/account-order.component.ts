import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrderTemplatesExportsModule } from 'src/app/extensions/order-templates/exports/order-templates-exports.module';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { IconModule } from 'ish-core/icon.module';
import { Order } from 'ish-core/models/order/order.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostCenterViewComponent } from 'ish-shared/components/basket/basket-cost-center-view/basket-cost-center-view.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { AccountOrderToBasketComponent } from '../account-order-to-basket/account-order-to-basket.component';

/**
 * The Order Page Component displays the details of an order.
 *
 * @example
 * <ish-order-page [order]="order" />
 */
@Component({
  selector: 'ish-account-order',
  templateUrl: './account-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AccountOrderToBasketComponent,
    CommonModule,
    RouterModule,
    IconModule,
    DatePipe,
    TranslateModule,
    ServerHtmlDirective,
    FeatureToggleDirective,
    InfoBoxComponent,
    BasketBuyerComponent,
    BasketCostCenterViewComponent,
    BasketCustomFieldsViewComponent,
    ServerSettingPipe,
    BasketMerchantMessageViewComponent,
    AddressComponent,
    BasketShippingMethodComponent,
    LineItemListComponent,
    BasketCostSummaryComponent,
    OrderTemplatesExportsModule,
  ],
})
export class AccountOrderComponent {
  @Input({ required: true }) order: Order;

  hasCustomFields(): boolean {
    return this.order?.customFields && Object.keys(this.order.customFields).length > 0;
  }
}
