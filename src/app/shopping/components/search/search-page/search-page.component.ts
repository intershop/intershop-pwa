import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';
import { ViewType } from '../../../../models/viewtype/viewtype.types';

@Component({
  selector: 'ish-search-page',
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {

  @Input() searchTerm: string;
  @Input() products: Product[];
  @Input() totalItems: number;
  @Input() viewType: ViewType;
  @Input() sortBy: string;
  @Input() sortKeys: string[];
  @Output() viewTypeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();

  changeViewType(viewType: ViewType) {
    this.viewTypeChange.emit(viewType);
  }

  changeSortBy(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }

}
