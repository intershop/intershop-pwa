import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';

/**
 * The Category Image Component renders an HTML tag img of an image of a Category.
 */
@Component({
  selector: 'ish-category-image',
  templateUrl: './category-image.component.html',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryImageComponent implements OnChanges {
  /**
   * The category for which the image should be displayed
   */
  @Input({ required: true }) category: Category;

  categoryImageUrl = '/assets/img/not-available.svg';

  ngOnChanges() {
    this.setCategoryImageUrl();
  }

  /**
   * Set the category image URL from the (non-)empty property effectiveUrl.
   * The URL to a non-empty effectiveUrl has a prefix URL of property icmBaseURL.
   */
  private setCategoryImageUrl() {
    if (this.category.images?.[0]?.effectiveUrl?.length > 0) {
      this.categoryImageUrl = `${this.category.images[0].effectiveUrl}`;
    }
  }
}
