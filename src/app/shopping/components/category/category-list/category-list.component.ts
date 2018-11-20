import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { ICM_BASE_URL } from 'ish-core/services/state-transfer/factories';

@Component({
  selector: 'ish-category-list',
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {
  @Input()
  categories: Category[];

  constructor(@Inject(ICM_BASE_URL) public icmBaseURL) {}
}
