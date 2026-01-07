import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationManagementExportsModule } from 'organization-management';
import { RequisitionManagementExportsModule } from 'requisition-management';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { PipesModule } from 'ish-core/pipes.module';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { OrderWidgetComponent } from 'ish-shared/components/order/order-widget/order-widget.component';

import { OrderTemplatesExportsModule } from '../../../extensions/order-templates/exports/order-templates-exports.module';
import { QuotingExportsModule } from '../../../extensions/quoting/exports/quoting-exports.module';
import { WishlistsExportsModule } from '../../../extensions/wishlists/exports/wishlists-exports.module';

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
    DirectivesModule,
    FeatureToggleModule,
    IconModule,
    OrderTemplatesExportsModule,
    OrderWidgetComponent,
    OrganizationManagementExportsModule,
    PipesModule,
    QuotingExportsModule,
    RequisitionManagementExportsModule,
    RoleToggleModule,
    RouterModule,
    TranslateModule,
    WishlistsExportsModule,
  ],
})
export class AccountOverviewComponent {
  @Input({ required: true }) user: User;
  @Input() customer: Customer;
}
