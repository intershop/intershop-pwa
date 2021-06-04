import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-checkout-review-tac-field',
  templateUrl: './checkout-review-tac-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewTacFieldComponent extends FieldType {
  formControl: FormControl;

  getArgs() {
    return this.to.args ? this.to.args : {};
  }
}
