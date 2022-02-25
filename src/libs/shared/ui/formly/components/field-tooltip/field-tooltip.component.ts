import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Component that renders a tooltip.
 * Takes an Input of type ``{ text: string; link: string; title?: string; class?: string }``.
 *
 * @usageNotes
 * * ``link`` determines the hoverable text.
 * * ``title`` determines the title of the tooltip.
 * * ``text`` determines the tooltip content.
 * * ``class`` is applied to the tooltip link.
 *
 * All texts are translated.
 *
 */
@Component({
  selector: 'ish-field-tooltip',
  templateUrl: './field-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTooltipComponent {
  @Input() tooltipInfo: { text: string; link: string; title?: string; class?: string };
}
