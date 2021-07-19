import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-shipping-radio-wrapper',
  templateUrl: './shipping-radio-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingRadioWrapperComponent extends FieldWrapper {
  get shippingMethod() {
    return this.to.shippingMethod;
  }
}
