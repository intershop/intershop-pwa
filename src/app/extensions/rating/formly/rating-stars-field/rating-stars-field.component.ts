import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { range } from 'lodash-es';

import { RatingFilledType } from '../../shared/product-rating-star/product-rating-star.component';

/**
 * Type that will render 5 stars to rate a product.
 */
@Component({
  selector: 'ish-rating-stars-field',
  templateUrl: './rating-stars-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingStarsFieldComponent extends FieldType<FieldTypeConfig> {
  get stars(): RatingFilledType[] {
    return range(1, 6).map(index => (index <= this.field?.formControl.value ? 'full' : 'empty'));
  }

  setStars(stars: number) {
    this.field.formControl.setValue(stars);
  }
}
