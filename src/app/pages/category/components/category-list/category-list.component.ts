import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';

@Component({
  selector: 'ish-category-list',
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {
  @Input() categories: Category[];

  trackByFn(_, item: CategoryView) {
    return item.uniqueId;
  }
}
