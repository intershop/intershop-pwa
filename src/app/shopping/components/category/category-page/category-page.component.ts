import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../../models/category/category.model';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CategoryPageComponent {

  @Input() category: Category;
  @Input() categoryPath: Category[];

}
