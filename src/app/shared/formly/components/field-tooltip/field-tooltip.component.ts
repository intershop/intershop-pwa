import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-field-tooltip',
  templateUrl: './field-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTooltipComponent {
  @Input() tooltipInfo: { title?: string; text: string; link: string };
}
