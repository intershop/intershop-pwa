import { Component, OnInit } from '@angular/core';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';
import { CategoryModel } from '../../../services/categories/category.model';
import { CategoryService } from '../../../services/categories/category.service';
import { SubcategoryModel } from '../../../services/categories/subcategory.model';
import { GlobalState } from '../../../services/global.state';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {
  categories: CategoryModel;
  subCategories: SubcategoryModel;
  local: string;

  constructor(private categoryService: CategoryService,
    private cacheService: CacheCustomService,
    public localize: LocalizeRouterService, private globalState: GlobalState) {

  }

  ngOnInit() {
    this.getCategories();
    this.globalState.subscribe('local', (localData) => {
      this.local = localData;
      this.getCategories();
    });
  }


  getCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  getSubCategories(categoryId) {
    const cacheKey = categoryId + this.local;
    if (this.cacheService.cacheKeyExists(cacheKey)) {
      this.subCategories = this.cacheService.getCachedData(cacheKey);
    } else {
      this.categoryService.getSubCategories(categoryId).subscribe(data => {
        this.subCategories = data;
        this.cacheService.storeDataToCache(this.subCategories, cacheKey);
      });
    }
  }
}
