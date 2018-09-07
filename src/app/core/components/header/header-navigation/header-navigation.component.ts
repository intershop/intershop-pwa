import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from '../../../../models/category-view/category-view.model';
import { Category } from '../../../../models/category/category.model';

/**
 * The Header Navigation Component displays the first level navigation.
 *
 * It uses the {@link SubCategoryNavigationComponent} for rendering sub categories.
 *
 * @example
 * <ish-header-navigation
 *   [categories]="categories$ | async"
 * >
 * </ish-header-navigation>
 */
@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationComponent {
  @Input()
  view = 'auto';

  @Input()
  categories: CategoryView[];

  openedCategories = [];

  /**
   * Handle sub menu show.
   * Adds hover class to rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }

  /**
   * Handle sub menu hide.
   * Removes hover class from rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }

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
