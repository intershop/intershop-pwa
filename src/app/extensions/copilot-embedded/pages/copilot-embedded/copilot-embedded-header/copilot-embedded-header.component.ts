import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-copilot-embedded-header',
  standalone: false,
  templateUrl: './copilot-embedded-header.component.html',
  styleUrls: ['./copilot-embedded-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedHeaderComponent {}
