import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { BuyersSelectComponent } from 'organization-management';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';

/**
 * Type that will render buyer select box, specific for the order history page.
 */
@Component({
  selector: 'ish-account-order-select-buyer-field',
  templateUrl: './account-order-select-buyer-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthorizationToggleDirective, BuyersSelectComponent],
})
export class AccountOrderSelectBuyerFieldComponent extends FieldType<FieldTypeConfig> {}
