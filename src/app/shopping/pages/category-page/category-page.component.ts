import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoriesService } from '../../../shared/services/categories/categories.service';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html'
})

export class CategoryPageComponent implements OnInit {

  category: Category = null;
  categoryPath: Category[] = []; // TODO: only category should be needed once the REST call returns the categoryPath as part of the category

  // TODO: these properties were copied from family-page.component and their relevance needs to be evaluated
  listView: Boolean;
  sortBy;
  totalItems: number;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit() {
    this.route.data.map(data => data.category).subscribe((category: Category) => {
      this.category = category;
      // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
      this.categoriesService.getCategoryPath(this.category, this.route.snapshot).subscribe((categoryPath: Category[]) => {
        this.categoryPath = categoryPath;
      });
    });
  }
}
