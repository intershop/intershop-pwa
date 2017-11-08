import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../services/categories/categories.model';
import { CategoriesService } from '../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent implements OnInit {

  @Input() category: Category;
  @Input() categoryPath: Category[];
  @Input() categoryLevel: number;

  constructor(
    public categoriesService: CategoriesService,
    public localizeRouterService: LocalizeRouterService
  ) { }

  ngOnInit() {

  }

}
