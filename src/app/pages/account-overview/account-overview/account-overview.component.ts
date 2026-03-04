import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BudgetWidgetComponent, CostCenterWidgetComponent } from 'organization-management';
import { ApprovalWidgetComponent, RequisitionWidgetComponent } from 'requisition-management';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { HtmlEncodePipe } from 'ish-core/pipes/html-encode.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { OrderWidgetComponent } from 'ish-shared/components/order/order-widget/order-widget.component';

import { OrderTemplateWidgetComponent } from '../../../extensions/order-templates/shared/order-template-widget/order-template-widget.component';
import { QuoteWidgetComponent } from '../../../extensions/quoting/shared/quote-widget/quote-widget.component';
import { WishlistWidgetComponent } from '../../../extensions/wishlists/shared/wishlist-widget/wishlist-widget.component';

/**
 * The Account Overview Page Component displays the account overview dashboard of the user's 'MyAccount' section.
 *
 * @example
 * <ish-account-overview [user]="user$ | async"></ish-account-overview>
 */
@Component({
  selector: 'ish-account-overview',
  templateUrl: './account-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AuthorizationToggleModule,
    ContentIncludeComponent,
    ServerHtmlDirective,
    FeatureToggleModule,
    IconModule,
    OrderTemplateWidgetComponent,
    OrderWidgetComponent,
    BudgetWidgetComponent,
    CostCenterWidgetComponent,
    HtmlEncodePipe,
    ServerSettingPipe,
    QuoteWidgetComponent,
    RequisitionWidgetComponent,
    ApprovalWidgetComponent,
    RoleToggleModule,
    RouterModule,
    TranslateModule,
    WishlistWidgetComponent,
  ],
})
export class AccountOverviewComponent {
  @Input({ required: true }) user: User;
  @Input() customer: Customer;
}
