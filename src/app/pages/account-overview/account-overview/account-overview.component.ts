import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BudgetWidgetComponent, CostCenterWidgetComponent } from 'organization-management';
import { ApprovalWidgetComponent, RequisitionWidgetComponent } from 'requisition-management';

import { AUTHORIZATION_TOGGLE_IMPORTS } from 'ish-core/authorization-toggle';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { HtmlEncodePipe } from 'ish-core/pipes/html-encode.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ROLE_TOGGLE_IMPORTS } from 'ish-core/role-toggle';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { OrderWidgetComponent } from 'ish-shared/components/order/order-widget/order-widget.component';

import { OrderTemplateWidgetComponent } from '../../../extensions/order-templates/shared/order-template-widget/order-template-widget.component';
import { QuoteWidgetComponent } from '../../../extensions/quoting/shared/quote-widget/quote-widget.component';
import { WishlistWidgetComponent } from '../../../extensions/wishlists/shared/wishlist-widget/wishlist-widget.component';

/**
 * The Account Overview Page Component displays the account overview dashboard of the user's 'MyAccount' section.
 *
 * @example
 * <ish-account-overview [user]="user$ | async" />
 */
@Component({
  selector: 'ish-account-overview',
  imports: [
    ...AUTHORIZATION_TOGGLE_IMPORTS,
    ContentIncludeComponent,
    ServerHtmlDirective,
    ...FEATURE_TOGGLE_IMPORTS,
    OrderTemplateWidgetComponent,
    OrderWidgetComponent,
    BudgetWidgetComponent,
    CostCenterWidgetComponent,
    HtmlEncodePipe,
    ServerSettingPipe,
    QuoteWidgetComponent,
    RequisitionWidgetComponent,
    ApprovalWidgetComponent,
    ...ROLE_TOGGLE_IMPORTS,
    TranslatePipe,
    WishlistWidgetComponent,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './account-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent {
  @Input({ required: true }) user: User;
  @Input() customer: Customer;
}
