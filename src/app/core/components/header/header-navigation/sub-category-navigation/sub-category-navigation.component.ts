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
}
