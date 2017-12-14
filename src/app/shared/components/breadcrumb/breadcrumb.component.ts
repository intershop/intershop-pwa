import { Component, Input } from '@angular/core';
import { Category } from '../../../models/category.model';
import { CategoriesService } from '../../services/categories/categories.service';

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
