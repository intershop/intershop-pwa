import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

import { FieldTooltipComponent } from 'ish-shared/formly/components/field-tooltip/field-tooltip.component';

/**
 * Wrapper to display a tooltip below the form field.
 *
 * @props **tooltip** - will be passed to the ´´<ish-tooltip>`` component. For more info refer to the component documentation.
 */
@Component({
  selector: 'ish-tooltip-wrapper',
  imports: [FieldTooltipComponent],
  standalone: true,
  templateUrl: './tooltip-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TooltipWrapperComponent extends FieldWrapper {}
