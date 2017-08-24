import { Component, OnInit } from '@angular/core'
import { CategoryModel } from './category-service/category.model';
import { SubcategoryModel } from './category-service/subcategory.model';
import { CategoryService } from './category-service/category.service';
import { CacheCustomService } from '../../../../shared/services/cache/cache-custom.service';

@Component({
  selector: 'is-headernavigation',
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
    })
  }

  getSubCategories(categoryId) {
    if (this.cacheService.cacheKeyExists(categoryId)) {
      this.subCategories = this.cacheService.getCachedData(categoryId);
    } else {
      this.categoryService.getSubCategories(categoryId).subscribe(data => {
        this.subCategories = data;
        this.cacheService.storeDataToCache(this.subCategories, categoryId);
      })
    }
  }
}
