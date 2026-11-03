import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { Image, ImageLoading } from 'ish-core/models/image/image.model';

/**
 * The Category Image Component renders an HTML tag img of an image of a Category.
 */
@Component({
  selector: 'ish-category-image',
  standalone: true,
  templateUrl: './category-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryImageComponent implements OnChanges {
  /** The category for which the image should be displayed */
  @Input({ required: true }) category: Category;
  @Input() loading: ImageLoading = 'lazy';

  categoryImageUrl = '/assets/img/not-available.svg';
  categoryImage: Image;

  ngOnChanges() {
    this.setCategoryImageUrl();
  }

  /**
   * Set the category image URL from the (non-)empty property effectiveUrl.
   * The URL to a non-empty effectiveUrl has a prefix URL of property icmBaseURL.
   */
  private setCategoryImageUrl() {
    const image = this.category.images?.[0];
    this.categoryImage = image?.effectiveUrl?.length > 0 ? image : undefined;
    this.categoryImageUrl = this.categoryImage ? `${this.categoryImage.effectiveUrl}` : '/assets/img/not-available.svg';
  }
}
