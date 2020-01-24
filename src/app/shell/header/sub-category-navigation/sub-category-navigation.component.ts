import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';

/**
 * The Sub Category Navigation Component displays second level category navigation.
 *
 * @example
 * <ish-sub-category-navigation
 *   [category]="category"
 *   [subCategoriesDepth]="1"
 * >
 * </ish-sub-category-navigation>
 */
@Component({
  selector: 'ish-sub-category-navigation',
  templateUrl: './sub-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryNavigationComponent {
  @Input() view = 'auto';
  @Input() category: CategoryView;
  @Input() subCategoriesDepth: number;

  openedCategories = [];

  constructor(@Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) public mainNavigationMaxSubCategoriesDepth: number) {}

  /**
   * Indicate if specific category is expanded.
   * @param category The category item.
   */
  isOpened(category: Category): boolean {
    return this.openedCategories.includes(category.uniqueId);
  }

  /**
   * Toggle category open state.
   * @param category The category item.
   */
  toggleOpen(category: Category) {
    const index = this.openedCategories.findIndex(id => id === category.uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(category.uniqueId);
  }
}
