import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  selector: 'is-category-page',
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
    private router: Router,
    private categoriesService: CategoriesService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { category: Category }) => {
      this.category = data.category;
      // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
      this.categoriesService.getCategoryPath(this.category, this.route.snapshot).subscribe((categoryPath: Category[]) => {
        this.categoryPath = categoryPath;
      });
    });
  }
}
