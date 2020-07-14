import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-tacton-configure-product',
  templateUrl: './tacton-configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class TactonConfigureProductComponent {
  @Input() product: ProductView;
}
