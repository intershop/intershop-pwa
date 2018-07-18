import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryView } from '../../../../models/category-view/category-view.model';
import { Product } from '../../../../models/product/product.model';
import { ViewType } from '../../../../models/viewtype/viewtype.types';

@Component({
  selector: 'ish-family-page',
  templateUrl: './family-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyPageComponent {
  @Input() category: CategoryView;
  @Input() products: Product[];
  @Input() totalItems: number;
  @Input() viewType: ViewType;
  @Input() sortBy: string;
  @Input() sortKeys: string[];
  @Output() viewTypeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();

  changeViewType(viewType: ViewType) {
    this.viewTypeChange.emit(viewType);
  }

  changeSortBy(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }
}
