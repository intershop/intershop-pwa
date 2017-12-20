import { Component, Input } from '@angular/core';
import { Category } from '../../../../../models/category/category.model';
import { CategoriesService } from '../../../../services/categories/categories.service';

@Component({
  selector: 'ish-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent {

  @Input() category: Category;
  @Input() subCategoriesDepth: number;

  constructor(
    public categoriesService: CategoriesService
  ) { }
}
