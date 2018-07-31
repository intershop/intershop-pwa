import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Category } from '../../../../models/category/category.model';

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
