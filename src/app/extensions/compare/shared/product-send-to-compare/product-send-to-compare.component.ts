import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-product-send-to-compare',
  templateUrl: './product-send-to-compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductSendToCompareComponent {
  constructor(private context: ProductContextFacade) {}

  addToCompare() {
    this.context.addToCompare();
  }
}
