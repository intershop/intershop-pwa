import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { CategoryView } from '../../../../../models/category-view/category-view.model';
import { Category } from '../../../../../models/category/category.model';
import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../../../configurations/injection-keys';

@Component({
  selector: 'ish-sub-category-navigation',
  templateUrl: './sub-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryNavigationComponent {
  @Input()
  category: CategoryView;
  @Input()
  subCategoriesDepth: number;

  openedCategories = [];

  constructor(@Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) public mainNavigationMaxSubCategoriesDepth: number) {}

  isOpened(category: Category): boolean {
    return this.openedCategories.includes(category.uniqueId);
  }

  toggleOpen(category: Category) {
    const index = this.openedCategories.findIndex(id => id === category.uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(category.uniqueId);
  }
}
