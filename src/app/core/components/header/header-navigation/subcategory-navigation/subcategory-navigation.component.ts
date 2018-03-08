import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../../../models/category/category.model';

@Component({
  selector: 'ish-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SubCategoryNavigationComponent {

  @Input() category: Category;
  @Input() subCategoriesDepth: number;
}
