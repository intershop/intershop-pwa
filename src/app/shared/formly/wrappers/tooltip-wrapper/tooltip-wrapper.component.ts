import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-tooltip-wrapper',
  template: `
    <ng-template #fieldComponent></ng-template>
    <ish-field-tooltip [tooltipInfo]="to.tooltip"> </ish-field-tooltip>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TooltipWrapperComponent extends FieldWrapper {}
