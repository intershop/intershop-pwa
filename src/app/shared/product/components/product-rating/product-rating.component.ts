import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { range } from 'lodash-es';

import { Product } from 'ish-core/models/product/product.model';

/**
 * The Product Rating Component renders rating stars for a product with rounded average rating as number.
 *
 * @example
 * <ish-product-rating [product]="product"></ish-product-rating>
 */
@Component({
  selector: 'ish-product-rating',
  templateUrl: './product-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRatingComponent {
  /**
   * The product for which the rating should be displayed.
   */
  @Input() product: Product;

  /**
   * returns an array to loop over the stars with a length of 5 and its index as values
   */
  get stars(): number[] {
    return range(5);
  }

  /**
   * decide the filling state of the current star
   * @param index index of the current star
   */
  getStarFilledState(index: number): 'full' | 'half' | 'empty' {
    if (this.product.roundedAverageRating) {
      const rate = this.product.roundedAverageRating;
      return index <= rate ? 'full' : index - 0.5 === rate ? 'half' : 'empty';
    } else {
      return 'empty';
    }
  }
}
