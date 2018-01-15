import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../models/category/category.model';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.map(data => data.category).subscribe((category: Category) => {
      this.category = category;
    });
    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    this.route.data.map(data => data.categoryPath).subscribe((categoryPath: Category[]) => {
      this.categoryPath = categoryPath;
    });
  }
}
