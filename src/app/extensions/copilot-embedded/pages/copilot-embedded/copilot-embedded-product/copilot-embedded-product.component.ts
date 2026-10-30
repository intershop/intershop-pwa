import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

/**
 * Renders a product recommended by the Copilot Embedded assistant as a compact row for the narrow results panel.
 */
@Component({
  selector: 'ish-copilot-embedded-product',
  standalone: false,
  templateUrl: './copilot-embedded-product.component.html',
  styleUrls: ['./copilot-embedded-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedProductComponent {
  product$: Observable<ProductView> = this.context.select('product');
  loading$: Observable<boolean> = this.context.select('loading');

  constructor(private context: ProductContextFacade) {}
}
