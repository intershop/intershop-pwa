import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product } from '../../../../models/product/product.model';
import { ViewType } from '../../../../models/types';

@Component({
  selector: 'ish-family-page',
  templateUrl: './family-page.component.html'
})

export class FamilyPageComponent {

  @Input() category: Category;
  @Input() categoryPath: Category[];
  @Input() products: Product[];
  @Input() totalItems: number;
  @Input() viewType: ViewType;
  @Input() sortBy: string;
  @Output() viewTypeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();

  changeViewType(viewType: ViewType) {
    this.viewTypeChange.emit(viewType);
  }

  changeSortBy(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }

}
