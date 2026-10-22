import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Displays the Copilot Embedded app icon, in default size for headers or enlarged for the chat welcome view.
 */
@Component({
  selector: 'ish-copilot-embedded-icon',
  standalone: false,
  templateUrl: './copilot-embedded-icon.component.html',
  styleUrls: ['./copilot-embedded-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedIconComponent {
  @Input() size: 'default' | 'large' = 'default';
}
