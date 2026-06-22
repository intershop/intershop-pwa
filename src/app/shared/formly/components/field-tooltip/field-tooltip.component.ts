import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [NgbPopover, NgClass, TranslatePipe],
  standalone: true,
  templateUrl: './field-tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTooltipComponent {
  @Input({ required: true }) tooltipInfo: { text: string; link: string; title?: string; class?: string };
}
