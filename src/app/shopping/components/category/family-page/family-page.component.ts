import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product } from '../../../../models/product/product.model';
import { ViewMode } from '../../../../models/types';

@Component({
  selector: 'ish-family-page',
  templateUrl: './family-page.component.html'
})

export class FamilyPageComponent {

  @Input() category: Category;
  @Input() categoryPath: Category[];
  @Input() products: Product[];
  @Input() totalItems: number;
  @Input() viewMode: ViewMode;
  @Input() sortBy: string;
  @Output() viewModeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();

  changeViewMode(viewMode: ViewMode) {
    this.viewModeChange.emit(viewMode);
  }

  changeSortBy(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }

}
