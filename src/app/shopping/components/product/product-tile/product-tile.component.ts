import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductTileComponent {

  @Input() product: Product;

}
