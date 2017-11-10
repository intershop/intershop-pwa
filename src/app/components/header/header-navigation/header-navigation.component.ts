import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';

@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  @Input() maxSubCategoriesDepth = 0;
  categories: Category[];

  constructor(
    public categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.categoriesService.getTopLevelCategories(this.maxSubCategoriesDepth).subscribe((response: Category[]) => {
      if (typeof (response) === 'object') {
        this.categories = response;
      }
    });
  }
}
