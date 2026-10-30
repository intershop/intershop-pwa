import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CopilotEmbeddedContextFacade } from '../../../facades/copilot-embedded-context.facade';
import { CopilotEmbeddedProduct } from '../../../models/copilot-embedded-product/copilot-embedded-product.model';

/**
 * Displays the products recommended in the conversation of the {@link CopilotEmbeddedContextFacade}.
 */
@Component({
  selector: 'ish-copilot-embedded-results',
  standalone: false,
  templateUrl: './copilot-embedded-results.component.html',
  styleUrls: ['./copilot-embedded-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedResultsComponent implements OnInit {
  products$: Observable<CopilotEmbeddedProduct[]>;

  constructor(private context: CopilotEmbeddedContextFacade) {}

  ngOnInit() {
    this.products$ = this.context.select('products');
  }
}
