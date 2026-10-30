import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Displays the Copilot icon, title and subtitle, with an optional button that resets the chat.
 */
@Component({
  selector: 'ish-copilot-embedded-header',
  standalone: false,
  templateUrl: './copilot-embedded-header.component.html',
  styleUrls: ['./copilot-embedded-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedHeaderComponent {
  @Input() canReset = true;

  @Output() readonly resetChat = new EventEmitter<void>();
}
