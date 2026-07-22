import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type that will render 5 stars to rate a product.
 */
@Component({
  selector: 'ish-rating-stars-field',
  standalone: false,
  templateUrl: './rating-stars-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingStarsFieldComponent extends FieldType<FieldTypeConfig> {}
