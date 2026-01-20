import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { OrganizationManagementExportsModule } from 'projects/organization-management/src/app/exports/organization-management-exports.module';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';

/**
 * Type that will render buyer select box, specific for the order history page.
 */
@Component({
  selector: 'ish-account-order-select-buyer-field',
  templateUrl: './account-order-select-buyer-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthorizationToggleDirective, FormlyModule, OrganizationManagementExportsModule],
})
export class AccountOrderSelectBuyerFieldComponent extends FieldType<FieldTypeConfig> {}
