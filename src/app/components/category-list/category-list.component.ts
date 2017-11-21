import { Component, Inject, Input, OnInit } from '@angular/core';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { ICM_BASE_URL } from '../../services/state-transfer/factories';

@Component({
  selector: 'is-category-list',
  templateUrl: './category-list.component.html'
})

export class CategoryListComponent implements OnInit {

  @Input() categories: Category[];

  constructor(
    public categoriesService: CategoriesService,
    @Inject(ICM_BASE_URL) public icmBaseURL
  ) { }

  ngOnInit() {
  }

}
