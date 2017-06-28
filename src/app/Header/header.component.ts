import { Component, OnInit } from '@angular/core';

import { Category } from '../services/category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'is-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CategoriesService]
})
export class HeaderComponent implements OnInit {

  categories: Category[];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoriesService.getCategories().then(categories => this.categories = categories);
  }

}
