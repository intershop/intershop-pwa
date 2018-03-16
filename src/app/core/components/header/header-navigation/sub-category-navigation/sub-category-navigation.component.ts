import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../../../models/category/category.model';

@Component({
  selector: 'ish-sub-category-navigation',
  templateUrl: './sub-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubCategoryNavigationComponent {

  @Input() category: Category;
  @Input() subCategoriesDepth: number;

  openedCategories = [];

  isOpened(category: Category): boolean {
    return this.openedCategories.includes(category.uniqueId);
  }

  toggleOpen(category: Category): void {
    const index = this.openedCategories.findIndex(id => id === category.uniqueId);
    (index > -1) ? this.openedCategories.splice(index, 1) : this.openedCategories.push(category.uniqueId);
  }
}
