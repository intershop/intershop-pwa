import { Component, Input } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'ish-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})

export class BreadcrumbComponent {

  @Input() separator = '/';
  @Input() showHome = true;
  @Input() category: Category;
  @Input() categoryPath: Category[]; // TODO: only category should be needed as input once the REST call returns the categoryPath as part of the category
  @Input() product: string; // TODO: product implementation


  constructor(
    public categoriesService: CategoriesService
  ) { }

}
