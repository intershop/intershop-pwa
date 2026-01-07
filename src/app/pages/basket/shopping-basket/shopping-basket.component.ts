import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OrderTemplatesExportsModule } from 'src/app/extensions/order-templates/exports/order-templates-exports.module';
import { PunchoutExportsModule } from 'src/app/extensions/punchout/exports/punchout-exports.module';
import { QuickorderExportsModule } from 'src/app/extensions/quickorder/exports/quickorder-exports.module';
import { QuotingExportsModule } from 'src/app/extensions/quoting/exports/quoting-exports.module';

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
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
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
 * />
 */
@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    TranslateModule,
    ModalDialogLinkComponent,
    ErrorMessageComponent,
    NgIf,
    BasketErrorMessageComponent,
    BasketInfoComponent,
    BasketValidationResultsComponent,
    NgFor,
    ServerHtmlDirective,
    BasketCostCenterSelectionComponent,
    BasketCustomFieldsComponent,
    SkipContentLinkComponent,
    FeatureToggleDirective,
    QuotingExportsModule,
    LineItemListComponent,
    LoadingComponent,
    OrderTemplatesExportsModule,
    ClearBasketComponent,
    QuickorderExportsModule,
    BasketPromotionCodeComponent,
    BasketCostSummaryComponent,
    BasketOrderRecurrenceEditComponent,
    ServerSettingPipe,
    NotRoleToggleDirective,
    PunchoutExportsModule,
    ShoppingBasketPaymentComponent,
    LazyLoadingContentDirective,
    AuthorizationToggleDirective,
  ],
})
export class ShoppingBasketComponent {
  @Input({ required: true }) basket: BasketView;
  @Input() error: HttpError;
  @Input() loading = false;

  @Output() readonly nextStep = new EventEmitter<void>();

  /**
   * checkout button leads to checkout address page if basket is valid
   */
  checkout() {
    this.nextStep.emit();
  }
}
