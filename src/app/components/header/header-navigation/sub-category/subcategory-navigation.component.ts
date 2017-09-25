import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../../services/categories/categories.model';
import { CacheCustomService } from '../../../../services/index';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent {
  allCategories: Category[] = [];
  uri = 'categories?view=tree&limit=';
  categoryKey = 'CategoryData';
  myDepth = [];
  @Input() parent;
  @Input() categoryLevel;
  constructor(private cacheService: CacheCustomService, private router: Router,
    public localize: LocalizeRouterService) {
  }

  navigate(subcategory) {
    this.cacheService.storeDataToCache(subcategory.hasOnlineSubCategories.toString(), 'isNonLeaf');
    let navigationPath = subcategory.uri.split('/categories')[1];
    navigationPath = '/category/' + navigationPath;
    this.router.navigate([this.localize.translateRoute(navigationPath)]);
  }
}
