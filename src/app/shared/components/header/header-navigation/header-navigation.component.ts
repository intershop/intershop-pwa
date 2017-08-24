import { Component, OnInit } from '@angular/core'
import { HeaderNavigationCategoryModel } from './header-navigation-service/header-navigation-category.model';
import { HeaderNavigationSubcategoryModel } from './header-navigation-service/header-navigation-subcategory.model';
import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs/Observable';
import { HeaderNavigationService } from './header-navigation-service/header-navigation.service';
import { CacheCustomService } from '../../../../shared/services/cache/cache-custom.service';

@Component({
  selector: 'is-headernavigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {
  categories: HeaderNavigationCategoryModel;
  subCategories: HeaderNavigationSubcategoryModel;

  constructor(private headerNavigationService: HeaderNavigationService, private cacheService: CacheCustomService) {

  }

  ngOnInit() {
    this.headerNavigationService.getCategories().subscribe(data => {
      this.categories = data;
    })
  }

  getSubCategories(categoryId) {
    if (this.cacheService.cacheKeyExists(categoryId)) {
      this.subCategories = this.cacheService.getCachedData(categoryId);
    } else {
      this.headerNavigationService.getSubCategories(categoryId).subscribe(data => {
        this.subCategories = data;
        this.cacheService.storeDataToCache(this.subCategories, categoryId);
      })
    }
  }
}
