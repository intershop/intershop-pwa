import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';

/**
 * The Category Tile Component renders a category tile with the image of the
 * category using {@link CategoryImageComponent}.
 *
 * @example
 * <ish-category-tile [category]="category"></ish-category-tile>
 */
@Component({
  selector: 'ish-category-tile',
  templateUrl: './category-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTileComponent {
  /**
   * The Category to render a tile for
   */
  @Input() category: Category;
}
