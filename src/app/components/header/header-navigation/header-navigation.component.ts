import { Component, Input, OnInit } from '@angular/core';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { Category } from './../../../services/categories/categories.model';
import { CategoriesService } from './../../../services/categories/categories.service';

@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  @Input() maxSubCategoriesDepth;
  categories: Category[];

  constructor(public localize: LocalizeRouterService, private categoryService: CategoriesService) {}

  ngOnInit() {
    // TODO: the url needs to go into the categories service
    this.categoryService.getCategories('categories?view=tree&limit=' + this.maxSubCategoriesDepth).subscribe((response: Category[]) => {
      if (typeof (response) === 'object') {
        this.categories = response;
      }
    });
  }
}
