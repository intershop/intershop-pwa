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
  @Input() selectedCategory: Category;
  @Input() selectedCategoryUri: string;
  expanded = false;
  expandedSubCategory: SubCategoryNavigationComponent;
  childSubCategories: SubCategoryNavigationComponent[] = [];
  constructor(private localizeRouterService: LocalizeRouterService, private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.expandIfSelected();
  }

  private expandIfSelected() {
    if (this.isCategoryPathSelected(this.category)) {
      this.expand();
    }
  }

  private isCategoryPathSelected(category: Category): boolean {
    if (!category.uri || this.selectedCategoryUri.startsWith(category.uri.split('/categories')[1])) {
      return true;
    }
  }

  private expand() {
    if (this.category.subCategories) {
      this.expanded = true;
      return;
    }

    if (!this.category.subCategories && this.category.hasOnlineSubCategories) {
      this.loadSubCategories();
    }
  }

  private loadSubCategories() {
    const uri = this.category.uri.split('/categories')[1];
    this.categoriesService.getCategory(uri).subscribe((data: any) => {
      this.expanded = true;
      this.category = data;
    });
  }
}


