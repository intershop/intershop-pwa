import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * Displays the header link to the Copilot Embedded page, as icon only in the `small` view (mobile header).
 */
@Component({
  selector: 'ish-copilot-embedded-link',
  standalone: false,
  templateUrl: './copilot-embedded-link.component.html',
  styleUrls: ['./copilot-embedded-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class CopilotEmbeddedLinkComponent {
  @Input() view: 'auto' | 'small' = 'auto';
}
