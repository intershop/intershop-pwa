import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FieldWrapper } from '@ngx-formly/core';
import { IconModule } from 'ish-core/icon.module';
import { ShippingInfoComponent } from '../shipping-info/shipping-info.component';
import { TranslateModule } from '@ngx-translate/core';

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
  standalone: true,
  imports: [NgClass, NgbPopoverModule, IconModule, ShippingInfoComponent, TranslateModule, NgIf],
})
export class ShippingRadioWrapperComponent extends FieldWrapper {}
