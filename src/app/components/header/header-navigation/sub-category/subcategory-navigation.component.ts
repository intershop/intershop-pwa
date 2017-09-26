import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent {
  @Input() parent;
  @Input() categoryLevel;
  constructor(private router: Router,
    public localize: LocalizeRouterService, private categoriesService: CategoriesService) {
  }

  navigate(subCategory) {
    this.categoriesService.setCurrentCategory(subCategory);
    const navigationPath = subCategory.uri.split('/categories')[1];
    this.router.navigate([this.localize.translateRoute('/category/' + navigationPath)]);
  }
}
