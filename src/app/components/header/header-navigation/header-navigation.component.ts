import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { ActivatedRoute } from "@angular/router";
import { CategoryNavigationService } from "../../../services/category-navigation.service";

@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  @Input() maxSubCategoriesDepth = 0;
  categories: Category[];

  constructor(
    public localize: LocalizeRouterService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.categoriesService.getTopLevelCategories(this.maxSubCategoriesDepth).subscribe((response: Category[]) => {
      if (typeof (response) === 'object') {
        this.categories = response;
      }
    });
  }
}
