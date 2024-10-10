import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

/**
 * Type that renders a terms and conditions field, specific for the checkout review form.
 */
@Component({
  selector: 'ish-checkout-review-tac-field',
  templateUrl: './checkout-review-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewTacFieldComponent extends FieldType<FieldTypeConfig> {
  get ariaDescribedByIds(): string | null {
    return ariaDescribedByIds(this.field.id, this.showError, this.props.customDescription);
  }
}
