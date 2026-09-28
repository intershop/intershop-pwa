import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CopilotEmbeddedProduct } from '../../../models/copilot-embedded-product/copilot-embedded-product.model';

@Component({
  selector: 'ish-copilot-embedded-results',
  standalone: false,
  templateUrl: './copilot-embedded-results.component.html',
  styleUrls: ['./copilot-embedded-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedResultsComponent {
  @Input() products: CopilotEmbeddedProduct[] = [];

  @Output() readonly backToChat = new EventEmitter<void>();
}
