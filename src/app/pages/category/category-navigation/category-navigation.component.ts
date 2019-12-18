import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { CategoryHelper } from 'ish-core/models/category/category.model';

@Component({
  selector: 'ish-category-navigation',
  templateUrl: './category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryNavigationComponent {
  @Input() category: CategoryView;
  @Input() categoryNavigationLevel: number;

  categoryEquals = CategoryHelper.equals;
}
