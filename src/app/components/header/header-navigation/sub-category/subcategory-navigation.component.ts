import { Component, Input } from '@angular/core';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent {
  @Input() parent;
  @Input() categoryLevel;
  constructor(
    public localizeRouterService: LocalizeRouterService, private categoriesService: CategoriesService) {
  }

  navigateToSubcategory(subCategory) {
    this.categoriesService.setCurrentCategory(subCategory);
    const navigationPath = subCategory.uri.split('/categories')[1];
    this.localizeRouterService.navigateToRoute('/category/' + navigationPath);
  }
}
