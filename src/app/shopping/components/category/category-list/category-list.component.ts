import { Component, Inject, Input } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { ICM_BASE_URL } from '../../../../core/services/state-transfer/factories';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'ish-category-list',
  templateUrl: './category-list.component.html'
})

export class CategoryListComponent {

  @Input() categories: Category[];

  constructor(
    public categoriesService: CategoriesService,
    @Inject(ICM_BASE_URL) public icmBaseURL
  ) { }

}
