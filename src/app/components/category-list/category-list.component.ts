import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-category-list',
  templateUrl: './category-list.component.html'
})

export class CategoryListComponent implements OnInit {

  @Input() categories: Category[];
  base_url = environment.base_url;

  constructor(
    public localize: LocalizeRouterService,
    public categoriesService: CategoriesService
  ) { }

  ngOnInit() {
  }

}
