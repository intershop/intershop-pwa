import { Component, Input } from '@angular/core';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-category-navigation',
  templateUrl: './category-navigation.component.html'
})

export class CategoryNavigationComponent {

  @Input() category: Category;
  @Input() categoryPath: Category[];
  @Input() categoryNavigationLevel: number;

  constructor(
    public categoriesService: CategoriesService,
    public localizeRouter: LocalizeRouterService
  ) { }

}
