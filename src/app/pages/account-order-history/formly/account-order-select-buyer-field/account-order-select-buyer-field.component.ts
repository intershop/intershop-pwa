import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render buyer select box, specific for the order history page.
 */
@Component({
  selector: 'ish-account-order-select-buyer-field',
  templateUrl: './account-order-select-buyer-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderSelectBuyerFieldComponent extends FieldType<FieldTypeConfig> {}
