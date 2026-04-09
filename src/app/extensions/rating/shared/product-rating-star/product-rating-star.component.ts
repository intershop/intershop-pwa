import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type RatingFilledType = 'full' | 'half' | 'empty';
/**
 * The Product Rating Star Component renders a single rating star.
 *
 * @example
 * <ish-product-rating-star filled="full" />
 */
@Component({
  selector: 'ish-product-rating-star',
  templateUrl: './product-rating-star.component.html',
  styleUrls: ['./product-rating-star.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class ProductRatingStarComponent {
  /**
   * filling state of the star
   */
  @Input() filled: RatingFilledType;
}
