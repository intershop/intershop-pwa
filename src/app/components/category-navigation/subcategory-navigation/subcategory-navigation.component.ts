import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent implements OnInit {
  @Input() category: Category;
  @Input() currentCategoryUri: string;
  expanded = false;

  constructor(private localizeRouterService: LocalizeRouterService, private categoriesService: CategoriesService) { }

  ngOnInit() {
    if (this.currentCategoryUri.startsWith(this.getCategoryUri(this.category))) {
      this.expand();
    }
  }

  expand() {
    if (this.category.subCategories) {
      this.expanded = true;
      return;
    }

    if (this.category.hasOnlineSubCategories) {
      this.loadSubCategories();
    }
  }

  isCurrentCategory(category) {
    return category.uri && this.currentCategoryUri === this.getCategoryUri(category);
  }

  loadSubCategories() {
    const uri = this.getCategoryUri(this.category);
    this.categoriesService.getCategory(uri).subscribe((data: any) => {
      this.expanded = true;
      this.category = data;
    });
  }

  getCategoryUri(category: Category): string {
    return category.uri ? category.uri.split('/categories')[1] : '';
  }
}
