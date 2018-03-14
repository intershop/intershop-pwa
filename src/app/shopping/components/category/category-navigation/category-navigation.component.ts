import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category, CategoryHelper } from '../../../../models/category/category.model';

@Component({
  selector: 'ish-category-navigation',
  templateUrl: './category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CategoryNavigationComponent {

  @Input() category: Category;
  @Input() categoryPath: Category[]; // TODO: only category should be needed as input once the REST call returns the categoryPath as part of the category
  @Input() categoryNavigationLevel: number;

  categoryEquals = CategoryHelper.equals;
}
