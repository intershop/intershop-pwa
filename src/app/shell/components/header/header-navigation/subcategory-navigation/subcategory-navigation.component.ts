import { Component, Input } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { CategoriesService } from '../../../../../shared/services/categories/categories.service';

@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent {

  @Input() category: Category;
  @Input() subCategoriesDepth: number;

  constructor(
    public categoriesService: CategoriesService
  ) { }
}
