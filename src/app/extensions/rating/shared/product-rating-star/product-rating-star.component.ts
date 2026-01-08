import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IconModule } from 'ish-core/icon.module';

export type RatingFilledType = 'full' | 'half' | 'empty';
/**
 * The Product Rating Star Component renders a single rating star.
 *
 * @example
 * <ish-product-rating-star filled="full"></ish-product-rating-star>
 */
@Component({
  selector: 'ish-product-rating-star',
  templateUrl: './product-rating-star.component.html',
  styleUrls: ['./product-rating-star.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IconModule, NgIf, NgClass],
})
export class ProductRatingStarComponent {
  /**
   * filling state of the star
   */
  @Input() filled: RatingFilledType;
}
