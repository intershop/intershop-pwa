import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Product Rating Star Component renders a single rating star.
 *
 * @example
 * <ish-product-rating-star filled="full" [lastStar]="true"></ish-product-rating-star>
 */
@Component({
  selector: 'ish-product-rating-star',
  templateUrl: './product-rating-star.component.html',
  styleUrls: ['./product-rating-star.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRatingStarComponent {
  /**
   * filling state of the star
   */
  @Input() filled: 'full' | 'half' | 'empty';
  /**
   * add space, when the star isn't the last one
   */
  @Input() lastStar = false;
}
