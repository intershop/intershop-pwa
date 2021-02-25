import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-tooltip-wrapper',
  templateUrl: './tooltip-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TooltipWrapperComponent extends FieldWrapper {}
