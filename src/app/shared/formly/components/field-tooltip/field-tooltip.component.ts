import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';

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
  standalone: true,
  imports: [CommonModule, IconModule, NgbPopoverModule, TranslateModule],
})
export class FieldTooltipComponent {
  @Input({ required: true }) tooltipInfo: { text: string; link: string; title?: string; class?: string };
}
