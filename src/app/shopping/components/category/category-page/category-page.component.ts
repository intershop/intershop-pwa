import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoryView } from '../../../../models/category-view/category-view.model';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent {
  @Input() category: CategoryView;
}
