import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that renders a terms and conditions field, specific for the checkout review form.
 */
@Component({
  selector: 'ish-checkout-review-tac-field',
  templateUrl: './checkout-review-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewTacFieldComponent extends FieldType<FieldTypeConfig> {}
