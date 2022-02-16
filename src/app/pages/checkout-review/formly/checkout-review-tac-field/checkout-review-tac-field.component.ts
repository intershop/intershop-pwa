import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-checkout-review-tac-field',
  templateUrl: './checkout-review-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewTacFieldComponent extends FieldType<FieldTypeConfig> {}
