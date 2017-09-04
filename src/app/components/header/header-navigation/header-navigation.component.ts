import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../../services/categories/category.model';
import { SubcategoryModel } from '../../../services/categories/subcategory.model';
import { CategoryService } from '../../../services/categories/category.service';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';

@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {
  categories: CategoryModel;
  subCategories: SubcategoryModel;

  constructor(private categoryService: CategoryService, private cacheService: CacheCustomService) {

  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  getSubCategories(categoryId) {
    if (this.cacheService.cacheKeyExists(categoryId)) {
      this.subCategories = this.cacheService.getCachedData(categoryId);
    } else {
      this.categoryService.getSubCategories(categoryId).subscribe(data => {
        this.subCategories = data;
        this.cacheService.storeDataToCache(this.subCategories, categoryId);
      });
    }
  }
}
