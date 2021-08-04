import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Wrapper to display a tooltip below the form field.
 *
 * @templateOption **tooltip** - will be passed to the ´´<ish-tooltip>`` component. For more info refer to the component documentation.
 */
@Component({
  selector: 'ish-tooltip-wrapper',
  templateUrl: './tooltip-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TooltipWrapperComponent extends FieldWrapper {}
