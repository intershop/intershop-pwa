import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CategoryView } from '../../../../models/category-view/category-view.model';

@Component({
  selector: 'ish-family-page',
  templateUrl: './family-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyPageComponent {
  /**
   * The the category leading to the displayed result.
   */
  @Input()
  category: CategoryView;

  /**
   * Request from the product-list to retrieve more products.
   */
  @Output()
  loadMore = new EventEmitter<void>();
}
