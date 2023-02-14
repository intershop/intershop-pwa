import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Wrapper that handles checkout specific formatting and display of radio buttons.
 *
 * @props **shippingMethod** that will have its description displayed.
 * @props **id** that will be used in the label.
 * @props **labelClass* that will be applied to the label.
 *
 */
@Component({
  selector: 'ish-shipping-radio-wrapper',
  templateUrl: './shipping-radio-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingRadioWrapperComponent extends FieldWrapper {}
