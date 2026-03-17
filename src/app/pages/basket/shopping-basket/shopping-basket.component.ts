/* eslint-disable ish-custom-rules/ban-imports-file-pattern */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BasketCreateOrderTemplateComponent } from 'src/app/extensions/order-templates/shared/basket-create-order-template/basket-create-order-template.component';
import { PunchoutTransferBasketComponent } from 'src/app/extensions/punchout/shared/punchout-transfer-basket/punchout-transfer-basket.component';
import { DirectOrderComponent } from 'src/app/extensions/quickorder/shared/direct-order/direct-order.component';
import { BasketAddToQuoteComponent } from 'src/app/extensions/quoting/shared/basket-add-to-quote/basket-add-to-quote.component';
import { QuotingBasketLineItemsComponent } from 'src/app/extensions/quoting/shared/quoting-basket-line-items/quoting-basket-line-items.component';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { NotRoleToggleDirective } from 'ish-core/directives/not-role-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BasketCostCenterSelectionComponent } from 'ish-shared/components/basket/basket-cost-center-selection/basket-cost-center-selection.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketCustomFieldsComponent } from 'ish-shared/components/basket/basket-custom-fields/basket-custom-fields.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { BasketPromotionCodeComponent } from 'ish-shared/components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ClearBasketComponent } from 'ish-shared/components/basket/clear-basket/clear-basket.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { BasketOrderRecurrenceEditComponent } from '../basket-order-recurrence-edit/basket-order-recurrence-edit.component';
import { ShoppingBasketPaymentComponent } from '../shopping-basket-payment/shopping-basket-payment.component';

/**
 * The Shopping Basket Component displays the users basket items, cost summary
 * and promotion code input.
 * It provides update cart and add cart to quote functionality.
 * It is the starting point for the checkout workflow.
 *
 * It uses the {@link LineItemListComponent} for the rendering of line items.
 * It uses the {@link BasketCostSummaryComponent} to render the cost summary.
 * It uses the {@link BasketPromotionCodeComponent} to render the promotion code input.
 *
 * @example
 * <ish-shopping-basket
 *   [basket]="basket"
 *   [error]="basketError$ | async"
 *   (nextStep)="nextStep()"
 * ></ish-shopping-basket>
 */
@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    TranslatePipe,
    ModalDialogLinkComponent,
    BasketErrorMessageComponent,
    BasketInfoComponent,
    BasketValidationResultsComponent,
    ServerHtmlDirective,
    BasketCostCenterSelectionComponent,
    BasketCustomFieldsComponent,
    SkipContentLinkComponent,
    FeatureToggleDirective,
    BasketAddToQuoteComponent,
    QuotingBasketLineItemsComponent,
    LineItemListComponent,
    LoadingComponent,
    BasketCreateOrderTemplateComponent,
    ClearBasketComponent,
    DirectOrderComponent,
    BasketPromotionCodeComponent,
    BasketCostSummaryComponent,
    BasketOrderRecurrenceEditComponent,
    ServerSettingPipe,
    NotRoleToggleDirective,
    PunchoutTransferBasketComponent,
    ShoppingBasketPaymentComponent,
    LazyLoadingContentDirective,
    AuthorizationToggleDirective],
})
export class ShoppingBasketComponent {
  @Input({ required: true }) basket: BasketView;
  @Input() error: HttpError;
  @Input() loading = false;

  @Output() nextStep = new EventEmitter<void>();

  /**
   * checkout button leads to checkout address page if basket is valid
   */
  checkout() {
    this.nextStep.emit();
  }
}
