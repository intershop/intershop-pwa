import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-row-actions',
  templateUrl: './product-row-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductRowActionsComponent {
  @Input() product: Product;
}
